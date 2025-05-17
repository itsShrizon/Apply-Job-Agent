from fastapi import HTTPException
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from app.core.dependencies import AuthenticatedUser, get_db
from app.features.resume.models import Resume
from app.features.resume.schemas import ResumeParseResponse
from app.shared.llm.llm_model import gpt_model
from langchain.output_parsers import PydanticOutputParser
import re
import os
from datetime import datetime
import subprocess


class ResumeService:
    @staticmethod
    def organize_resume_data(resume_text):
        """
        Organizes the parsed resume data using a language model.

        Args:
            resume_text (str): The raw text extracted from the resume

        Returns:
            dict: Structured resume information in JSON format

        Raises:
            HTTPException: If there's an error organizing the resume data
        """
        try:
            with open("app/shared/prompts/resumes/resume_parser.md", "r") as file:
                prompt = file.read()

            # Output parse for the LLM
            parser = PydanticOutputParser(pydantic_object=ResumeParseResponse)

            # Create a prompt template
            prompt = PromptTemplate(
                template=prompt,
                input_variables=["resume_text"],
                partial_variables={
                    "format_instructions": parser.get_format_instructions()
                },
            )

            # Create the chain
            chain = prompt | gpt_model | parser

            # Get response
            response = chain.invoke({"resume_text": resume_text})
            

            return response
        except Exception as e:
            # Log the error
            print(f"Error organizing resume data: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to organize resume data: {str(e)}"
            )
           
    @staticmethod
    def store_resume_data_in_db(resume_data, current_user: AuthenticatedUser, db):
        try:
            new_resume = Resume(
                user_id=current_user.id,
                resume_data=resume_data.dict(),  # Convert Pydantic model to dict
            )
            db.add(new_resume)
            db.commit()
            db.refresh(new_resume)
            return True
        
        except Exception as e:
            # Log the error
            print(f"Error storing resume data in DB: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to store resume data in DB: {str(e)}"
            )
            
    @staticmethod
    def get_resume_data_from_db(current_user: AuthenticatedUser, db):
        try:
            resume = db.query(Resume).filter(Resume.user_id == current_user.id
            ).order_by(Resume.created_at.desc()).first()

            if not resume:
                raise HTTPException(status_code=404, detail="Resume not found")

            return resume.resume_data

        except Exception as e:
            # Log the error
            print(f"Error retrieving resume data from DB: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to retrieve resume data from DB: {str(e)}"
            )

class CustomResumeBuilder:
    @staticmethod
    def get_latex_code_from_pydantic_output(job_description, resume_data):
        """
        Generates LaTeX code from the parsed resume data and job description.
        Args:
            job_description (str): The job description text
            resume_data (ResumeParseResponse): The structured resume data
        Returns:
            dict: Contains LaTeX code for the resume and the file path where it was saved
        Raises:
            HTTPException: If there's an error generating the LaTeX code
        """
        try:
            # Load the LaTeX template
            with open("app/shared/prompts/resumes/latex_resume_template.md", "r") as file:
                latex_template = file.read()

            # Load example files for one-shot prompting
            example_files = {
                "output": "app/shared/prompts/resumes/example_output.md"
            }
            
            examples = {}
            for key, path in example_files.items():
                try:
                    with open(path, "r") as file:
                        examples[key] = file.read()
                except FileNotFoundError as e:
                    print(f"Warning: Example file not found: {path}")
                    examples[key] = f"Example {key} not available"

            # Load the prompt template
            with open("app/shared/prompts/resumes/resume_generate.md", "r") as file:
                prompt_text = file.read()

            # Create a prompt template
            prompt = PromptTemplate(
                template=prompt_text,
                input_variables=[
                    "latex_resume_template",
                    "example_generated_output",
                    "resume_data",
                    "job_description",
                ],
            )

            # Create the chain
            chain = prompt | gpt_model

            # Get response
            response = chain.invoke(
                {
                    "latex_resume_template": latex_template,
                    "example_generated_output": examples["output"],
                    "resume_data": resume_data,
                    "job_description": job_description,
                }
            )

            # Parse the response to get the LaTeX code
            latex_code = response.content

            # Clean up any markdown code block formatting from the response
            latex_code = re.sub(r'^```(?:latex)?\s*', '', latex_code, flags=re.MULTILINE)
            latex_code = re.sub(r'\s*```$', '', latex_code, flags=re.MULTILINE)
            latex_code = latex_code.strip()
            
            # Save the LaTeX code to a file
            output_dir = "app/output/latex"
            os.makedirs(output_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"resume_{timestamp}.tex"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, "w") as file:
                file.write(latex_code)
                
            return {
                "latex_code": latex_code,
                "filepath": filepath
            }

        except Exception as e:
            # Log the error
            print(f"Error generating LaTeX code: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to generate LaTeX code: {str(e)}"
            )

    @staticmethod
    def compile_latex_to_pdf(latex_filepath):
        """
        Compiles the LaTeX file to a PDF.
        Args:
            latex_filepath (str): Path to the LaTeX file
        Returns:
            str: Path to the generated PDF file
        Raises:
            HTTPException: If there's an error compiling the LaTeX file
        """
        try:
            # Extract the filename without path
            latex_filename = os.path.basename(latex_filepath)
            
            # Change to the directory containing the LaTeX file for compilation
            latex_dir = os.path.dirname(latex_filepath)
            # Save the current working directory
            original_dir = os.getcwd()
            
            try:
                # Change to the directory containing the LaTeX file
                os.chdir(latex_dir)
                
                # Run pdflatex
                os.system(f"pdflatex {latex_filename}")
                
                # Generate PDF filepath
                pdf_filename = latex_filename.replace('.tex', '.pdf')
                pdf_filepath = os.path.join(latex_dir, pdf_filename)
                
                return pdf_filepath
                
            finally:
                # Return to original directory regardless of success or failure
                os.chdir(original_dir)
                
        except Exception as e:
            print(f"Error compiling LaTeX to PDF: {str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Failed to compile LaTeX to PDF: {str(e)}"
            )

    @staticmethod
    def cleanup_latex_files(latex_filepath):
        """
        Cleans up LaTeX files and compilation artifacts after PDF has been generated.
        Args:
            latex_filepath (str): Path to the LaTeX file
        """
        try:
            # Extract directory and base filename (without extension)
            latex_dir = os.path.dirname(latex_filepath)
            base_filename = os.path.splitext(os.path.basename(latex_filepath))[0]
            
            # List of file extensions to delete
            extensions = ['.tex', '.aux', '.log', '.out', '.pdf']
            
            # Delete each file with these extensions
            for ext in extensions:
                file_path = os.path.join(latex_dir, f"{base_filename}{ext}")
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"Deleted: {file_path}")
            
            print(f"Successfully cleaned up LaTeX files for: {base_filename}")
        
        except Exception as e:
            # Just log the error but don't raise an exception
            # We don't want cleanup errors to affect the user experience
            print(f"Warning: Failed to clean up LaTeX files: {str(e)}")