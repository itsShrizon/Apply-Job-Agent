from fastapi import HTTPException
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from app.core.dependencies import AuthenticatedUser, get_db
from app.features.resume.models import Resume, CoverLetter
from app.features.resume.schemas import ResumeParseResponse
from app.shared.llm.llm_model import gpt_model
from langchain.output_parsers import PydanticOutputParser
import re
import os
from datetime import datetime
import subprocess
import uuid


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
                    "example_output",
                    "job_description",
                    "latex_resume_template",
                    "resume_data",
                ],
            )

            # Create the chain
            chain = prompt | gpt_model

            # Get response
            response = chain.invoke(
                {
                    "latex_resume_template": latex_template,
                    "example_output": examples["output"],
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

class CoverLetterService:
    @staticmethod
    def generate_cover_letter(
        resume_data, 
        job_description, 
        company_name, 
        position_title, 
        hiring_manager_name=None, 
        additional_details=None
    ):
        """
        Generate a cover letter based on the resume data and job description.
        
        Args:
            resume_data (dict): The parsed resume data
            job_description (str): The job description
            company_name (str): The name of the company
            position_title (str): The title of the position
            hiring_manager_name (str, optional): The name of the hiring manager
            additional_details (str, optional): Additional details about the job or company
            
        Returns:
            str: The generated cover letter
        """
        try:
            # Load the cover letter prompt template
            with open("app/shared/prompts/cover_letters/cover_letter_generate.md", "r") as file:
                prompt_text = file.read()
                
            # Create a prompt template
            prompt = PromptTemplate(
                template=prompt_text,
                input_variables=[
                    "resume_data",
                    "job_description",
                    "company_name",
                    "position_title",
                    "hiring_manager_name",
                    "additional_details",
                ],
            )
            
            # Create the chain
            chain = prompt | gpt_model
            
            # Get response
            response = chain.invoke(
                {
                    "resume_data": resume_data,
                    "job_description": job_description,
                    "company_name": company_name,
                    "position_title": position_title,
                    "hiring_manager_name": hiring_manager_name or "Hiring Manager",
                    "additional_details": additional_details or "",
                }
            )
            
            # Return the cover letter content
            return response.content
            
        except Exception as e:
            # Log the error
            print(f"Error generating cover letter: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to generate cover letter: {str(e)}"
            )
    
    @staticmethod
    def store_cover_letter_in_db(
        cover_letter_content, 
        job_description, 
        current_user: AuthenticatedUser, 
        db,
        resume_id=None
    ):
        """
        Store the generated cover letter in the database.
        
        Args:
            cover_letter_content (str): The content of the cover letter
            job_description (str): The job description
            current_user (AuthenticatedUser): The authenticated user
            db (Session): Database session
            resume_id (UUID, optional): ID of the resume to link to the cover letter
            
        Returns:
            CoverLetter: The created cover letter object
        """
        try:
            # If no resume_id is provided, get the latest resume for the user
            if resume_id is None:
                resume = db.query(Resume).filter(
                    Resume.user_id == current_user.id
                ).order_by(Resume.created_at.desc()).first()
                
                if not resume:
                    raise HTTPException(status_code=404, detail="No resume found for the user")
                    
                resume_id = resume.id
                
            # Create a new cover letter
            new_cover_letter = CoverLetter(
                user_id=current_user.id,
                resume_id=resume_id,
                job_description=job_description,
                cover_letter_content=cover_letter_content,
            )
            
            # Add to database and commit
            db.add(new_cover_letter)
            db.commit()
            db.refresh(new_cover_letter)
            
            return new_cover_letter
            
        except Exception as e:
            # Log the error
            print(f"Error storing cover letter in DB: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to store cover letter in DB: {str(e)}"
            )
    
    @staticmethod
    def get_cover_letters_for_user(current_user: AuthenticatedUser, db):
        """
        Get all cover letters for a user.
        
        Args:
            current_user (AuthenticatedUser): The authenticated user
            db (Session): Database session
            
        Returns:
            List[CoverLetter]: A list of cover letters
        """
        try:
            # Query cover letters for the user
            cover_letters = db.query(CoverLetter).filter(
                CoverLetter.user_id == current_user.id
            ).order_by(CoverLetter.created_at.desc()).all()
            
            return cover_letters
            
        except Exception as e:
            # Log the error
            print(f"Error getting cover letters from DB: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to get cover letters from DB: {str(e)}"
            )
    
    @staticmethod
    def get_cover_letter_by_id(cover_letter_id, current_user: AuthenticatedUser, db):
        """
        Get a specific cover letter by ID.
        
        Args:
            cover_letter_id (UUID): The ID of the cover letter
            current_user (AuthenticatedUser): The authenticated user
            db (Session): Database session
            
        Returns:
            CoverLetter: The cover letter object
        """
        try:
            # Query cover letter by ID and user
            cover_letter = db.query(CoverLetter).filter(
                CoverLetter.id == cover_letter_id,
                CoverLetter.user_id == current_user.id
            ).first()
            
            if not cover_letter:
                raise HTTPException(status_code=404, detail="Cover letter not found")
                
            return cover_letter
            
        except Exception as e:
            # Log the error
            print(f"Error getting cover letter from DB: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to get cover letter from DB: {str(e)}"
            )
    
    @staticmethod
    def format_cover_letter_for_pdf(cover_letter_content):
        """
        Format the cover letter content for PDF generation using LaTeX.
        
        Args:
            cover_letter_content (str): The content of the cover letter
            
        Returns:
            dict: Contains LaTeX code for the cover letter and the file path
        """
        try:
            # Load the LaTeX template for cover letter
            with open("app/shared/prompts/cover_letters/latex_cover_letter_template.md", "r") as file:
                latex_template = file.read()
                
            # Replace placeholders in the template
            latex_code = latex_template.replace("{{COVER_LETTER_CONTENT}}", cover_letter_content)
            
            # Save the LaTeX code to a file
            output_dir = "app/output/latex"
            os.makedirs(output_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"cover_letter_{timestamp}.tex"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, "w") as file:
                file.write(latex_code)
                
            return {
                "latex_code": latex_code,
                "filepath": filepath
            }
            
        except Exception as e:
            # Log the error
            print(f"Error formatting cover letter for PDF: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to format cover letter for PDF: {str(e)}"
            )

class ResumeWithCoverLetterService:
    @staticmethod
    def generate_resume_with_cover_letter(
        resume_data,
        job_description,
        company_name,
        position_title,
        hiring_manager_name=None,
        additional_details=None
    ):
        """
        Generate both a resume and cover letter in a single combined PDF.
        
        Args:
            resume_data (dict): The parsed resume data
            job_description (str): The job description
            company_name (str): The name of the company
            position_title (str): The title of the position
            hiring_manager_name (str, optional): The name of the hiring manager
            additional_details (str, optional): Additional details about the job or company
            
        Returns:
            dict: Contains file paths to the resume and cover letter PDF files
        """
        try:
            # First, generate the custom resume
            resume_result = CustomResumeBuilder.get_latex_code_from_pydantic_output(
                job_description=job_description,
                resume_data=resume_data
            )
            resume_latex_filepath = resume_result["filepath"]
            
            # Compile the resume to PDF
            resume_pdf_filepath = CustomResumeBuilder.compile_latex_to_pdf(resume_latex_filepath)
            
            # Generate the cover letter
            cover_letter_content = CoverLetterService.generate_cover_letter(
                resume_data=resume_data,
                job_description=job_description,
                company_name=company_name,
                position_title=position_title,
                hiring_manager_name=hiring_manager_name,
                additional_details=additional_details
            )
            
            # Format the cover letter for PDF
            cover_letter_result = CoverLetterService.format_cover_letter_for_pdf(cover_letter_content)
            cover_letter_latex_filepath = cover_letter_result["filepath"]
            
            # Compile the cover letter to PDF
            cover_letter_pdf_filepath = CustomResumeBuilder.compile_latex_to_pdf(cover_letter_latex_filepath)
            
            # Return both file paths
            return {
                "resume_pdf_filepath": resume_pdf_filepath,
                "cover_letter_pdf_filepath": cover_letter_pdf_filepath,
                "cover_letter_content": cover_letter_content
            }
            
        except Exception as e:
            # Log the error
            print(f"Error generating resume with cover letter: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to generate resume with cover letter: {str(e)}"
            )
    
    @staticmethod
    def combine_pdfs(resume_pdf_filepath, cover_letter_pdf_filepath):
        """
        Combine the resume and cover letter PDFs into a single PDF file.
        
        Args:
            resume_pdf_filepath (str): Path to the resume PDF file
            cover_letter_pdf_filepath (str): Path to the cover letter PDF file
            
        Returns:
            str: Path to the combined PDF file
        """
        try:
            # Create output directory if it doesn't exist
            output_dir = "app/output/combined"
            os.makedirs(output_dir, exist_ok=True)
            
            # Generate output filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_filename = f"resume_with_cover_letter_{timestamp}.pdf"
            output_filepath = os.path.join(output_dir, output_filename)
            
            # Use PyPDF2 to combine the PDFs
            os.system(f"pdftk {cover_letter_pdf_filepath} {resume_pdf_filepath} cat output {output_filepath}")
            
            return output_filepath
            
        except Exception as e:
            # Log the error
            print(f"Error combining PDFs: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to combine PDFs: {str(e)}"
            )