from fastapi import HTTPException
from langchain_core.prompts import PromptTemplate
from app.core.dependencies import AuthenticatedUser
from app.features.cover_letter.models import CoverLetter
from app.shared.llm.llm_model import gpt_model
import os
from datetime import datetime
import subprocess
import tempfile
import uuid

class CoverLetterService:
    @staticmethod
    def generate_cover_letter(
        resume_data, 
        job_description, 
        company_name=None,
        position_title=None,
        hiring_manager_name=None,
        additional_notes=None
    ):
        """
        Generates a cover letter based on resume data and job description.
        
        Args:
            resume_data: The structured resume data
            job_description: The job description
            company_name: Optional name of the company
            position_title: Optional title of the position
            hiring_manager_name: Optional name of the hiring manager
            additional_notes: Optional additional notes or requirements
            
        Returns:
            str: Generated cover letter content
            
        Raises:
            HTTPException: If there's an error generating the cover letter
        """
        try:
            # Load the cover letter prompt template
            with open("app/shared/prompts/cover_letters/cover_letter_generate.md", "r") as file:
                prompt_text = file.read()
                
            # Prepare input variables
            input_vars = {
                "resume_data": resume_data,
                "job_description": job_description,
            }
            
            # Add optional parameters if provided
            if company_name:
                input_vars["company_name"] = company_name
            if position_title:
                input_vars["position_title"] = position_title
            if hiring_manager_name:
                input_vars["hiring_manager_name"] = hiring_manager_name
            if additional_notes:
                input_vars["additional_notes"] = additional_notes
                
            # Create a prompt template with dynamic input variables
            input_variables = ["resume_data", "job_description"]
            if company_name:
                input_variables.append("company_name")
            if position_title:
                input_variables.append("position_title")
            if hiring_manager_name:
                input_variables.append("hiring_manager_name")
            if additional_notes:
                input_variables.append("additional_notes")
                
            prompt = PromptTemplate(
                template=prompt_text,
                input_variables=input_variables
            )
            
            # Create the chain
            chain = prompt | gpt_model
            
            # Get response
            response = chain.invoke(input_vars)
            
            # Extract the cover letter content
            cover_letter_content = response.content.strip()
            
            return cover_letter_content
            
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
        resume_id,
        current_user: AuthenticatedUser, 
        db
    ):
        """
        Stores a cover letter in the database.
        
        Args:
            cover_letter_content: The generated cover letter content
            job_description: The job description
            resume_id: The ID of the associated resume
            current_user: The authenticated user
            db: Database session
            
        Returns:
            CoverLetter: The saved cover letter object
            
        Raises:
            HTTPException: If there's an error storing the cover letter
        """
        try:
            new_cover_letter = CoverLetter(
                user_id=current_user.id,
                resume_id=resume_id,
                job_description=job_description,
                cover_letter_content=cover_letter_content,
            )
            
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
    def get_cover_letter_by_id(cover_letter_id, current_user: AuthenticatedUser, db):
        """
        Retrieves a cover letter by ID.
        
        Args:
            cover_letter_id: The ID of the cover letter
            current_user: The authenticated user
            db: Database session
            
        Returns:
            CoverLetter: The cover letter object
            
        Raises:
            HTTPException: If the cover letter is not found or belongs to another user
        """
        try:
            cover_letter = db.query(CoverLetter).filter(
                CoverLetter.id == cover_letter_id,
                CoverLetter.user_id == current_user.id
            ).first()
            
            if not cover_letter:
                raise HTTPException(status_code=404, detail="Cover letter not found")
                
            return cover_letter
            
        except Exception as e:
            # Log the error
            print(f"Error retrieving cover letter from DB: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to retrieve cover letter from DB: {str(e)}"
            )
    
    @staticmethod
    def get_user_cover_letters(current_user: AuthenticatedUser, db):
        """
        Retrieves all cover letters for a user.
        
        Args:
            current_user: The authenticated user
            db: Database session
            
        Returns:
            List[CoverLetter]: List of cover letter objects
            
        Raises:
            HTTPException: If there's an error retrieving the cover letters
        """
        try:
            cover_letters = db.query(CoverLetter).filter(
                CoverLetter.user_id == current_user.id
            ).order_by(CoverLetter.created_at.desc()).all()
            
            return cover_letters
            
        except Exception as e:
            # Log the error
            print(f"Error retrieving user's cover letters from DB: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to retrieve user's cover letters from DB: {str(e)}"
            )
            
    @staticmethod
    def generate_cover_letter_pdf(cover_letter_content):
        """
        Generates a PDF from cover letter content.
        
        Args:
            cover_letter_content: The cover letter content
            
        Returns:
            str: Path to the generated PDF file
            
        Raises:
            HTTPException: If there's an error generating the PDF
        """
        try:
            # Create LaTeX content
            latex_content = CoverLetterService._create_latex_content(cover_letter_content)
            
            # Create a temporary directory for LaTeX compilation
            temp_dir = tempfile.mkdtemp()
            temp_filename = f"cover_letter_{uuid.uuid4().hex}"
            tex_path = os.path.join(temp_dir, f"{temp_filename}.tex")
            
            # Write LaTeX content to file
            with open(tex_path, "w") as f:
                f.write(latex_content)
                
            # Compile LaTeX to PDF
            original_dir = os.getcwd()
            try:
                # Change to temp directory
                os.chdir(temp_dir)
                
                # Run pdflatex
                subprocess.run(["pdflatex", f"{temp_filename}.tex"], check=True)
                
                # PDF path
                pdf_path = os.path.join(temp_dir, f"{temp_filename}.pdf")
                
                return pdf_path
                
            finally:
                # Return to original directory
                os.chdir(original_dir)
                
        except Exception as e:
            # Log the error
            print(f"Error generating cover letter PDF: {str(e)}")
            # Return an error message that can be used in an HTTP response
            raise HTTPException(
                status_code=500, detail=f"Failed to generate cover letter PDF: {str(e)}"
            )
            
    @staticmethod
    def _create_latex_content(cover_letter_content):
        """
        Creates LaTeX content for a cover letter.
        
        Args:
            cover_letter_content: The cover letter content
            
        Returns:
            str: LaTeX content
        """
        # Extract the date
        today = datetime.now().strftime("%B %d, %Y")
        
        # Format paragraphs from the cover letter content
        paragraphs = cover_letter_content.split("\n\n")
        formatted_paragraphs = "\n\n".join([f"{p}" for p in paragraphs])
        
        # Create LaTeX content
        latex_content = f"""\\documentclass[11pt,a4paper]{{letter}}
                        \\usepackage[utf8]{{inputenc}}
                        \\usepackage[T1]{{fontenc}}
                        \\usepackage{{lmodern}}
                        \\usepackage{{hyperref}}
                        \\usepackage[margin=1in]{{geometry}}
                        \\usepackage{{color}}
                        \\usepackage{{parskip}}

                        \\begin{{document}}

                        \\date{{{today}}}

                        {formatted_paragraphs}

                        \\end{{document}}
                        """
        return latex_content
            
    @staticmethod
    def cleanup_files(filepath):
        """
        Cleans up temporary files.
        
        Args:
            filepath: Path to the file to clean up
        """
        try:
            # Get the directory containing the file
            directory = os.path.dirname(filepath)
            
            # Remove the file
            if os.path.exists(filepath):
                os.remove(filepath)
                
            # Remove auxiliary files
            base_name = os.path.splitext(os.path.basename(filepath))[0]
            extensions = ['.tex', '.aux', '.log', '.out']
            
            for ext in extensions:
                aux_path = os.path.join(directory, f"{base_name}{ext}")
                if os.path.exists(aux_path):
                    os.remove(aux_path)
                    
            # Try to remove the directory (will only work if empty)
            try:
                os.rmdir(directory)
            except OSError:
                # Directory not empty, ignore
                pass
                
            print(f"Successfully cleaned up files for: {filepath}")
            
        except Exception as e:
            # Just log the error but don't raise an exception
            print(f"Warning: Failed to clean up files: {str(e)}")