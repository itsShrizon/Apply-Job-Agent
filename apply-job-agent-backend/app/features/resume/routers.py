import os
from fastapi import APIRouter, UploadFile, Depends, BackgroundTasks
from app.core.dependencies import AuthenticatedUser, get_db
from sqlalchemy.orm import Session
from app.features.resume.schemas import CustomResumeRequest, ResumeParseResponse
from app.features.resume.services import CustomResumeBuilder, ResumeService
from fastapi.responses import JSONResponse
from fastapi import HTTPException
import pymupdf4llm
from fastapi.responses import FileResponse
import shutil

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post(
    "/upload", 
    response_model=ResumeParseResponse
)
async def upload_resume(
    file: UploadFile,
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
) -> ResumeParseResponse:
    """
    Upload a resume file and parse its content.
    Args:
        file (UploadFile): The uploaded resume file.
        current_user (AuthenticatedUser): The authenticated user.
        db (Session): Database session.
    Returns:
        ResumeParseResponse: The parsed resume data.
    """
    # Save the file to a temporary location
    temp_path = f"/tmp/{file.filename}"
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    try:
        # Write the file to disk
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        
        # Parse the resume using pymupdf4llm
        resume_md_text = pymupdf4llm.to_markdown(temp_path)
        
        # Remove the file after parsing
        os.remove(temp_path)
        
        # Organize the parsed data using the llm
        result = ResumeService.organize_resume_data(resume_md_text)
        
        # Store the parsed data in the database
        ResumeService.store_resume_data_in_db(
            resume_data=result,
            current_user=current_user,
            db=db
        )
        
        # Return a successful response with the parsed data
        return result
    
    # Ensure the file is deleted even if an error occurs
    finally:
        # Delete the file after we're done with it
        if os.path.exists(temp_path):
            os.remove(temp_path)
            print(f"Deleted temporary file: {temp_path}")
            
@router.get(
    "/get-resume-data",
    response_model=ResumeParseResponse,
    summary="Get resume data",
    description="Retrieve resume data for the authenticated user."
)
async def get_resume_data(
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
) -> ResumeParseResponse:
    """
    Get the resume data for the authenticated user.
    Args:
        current_user (AuthenticatedUser): The authenticated user.
        db (Session): Database session.
    Returns:
        ResumeParseResponse: The resume data for the user.
    """
    try:
        # Fetch the resume data from the database
        resume_data = ResumeService.get_resume_data_from_db(current_user, db)
        
        # Return the resume data
        return resume_data
    except Exception as e:
        # Log the error
        print(f"Error fetching resume data: {str(e)}")
        # Return an error message that can be used in an HTTP response
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch resume data: {str(e)}"
        )

@router.get(
    "/build-custom-resume",
)
async def build_custom_resume(
    # customResumeRequest: CustomResumeRequest,
    job_description: str,
    background_tasks: BackgroundTasks,
    resume_data: ResumeParseResponse = Depends(get_resume_data)
):
    """
    Generate LaTeX code from the parsed resume data and job description.
    Args:
        customResumeRequest (CustomResumeRequest): The request containing job description.
        background_tasks (BackgroundTasks): Background tasks for file cleanup.
        resume_data (ResumeParseResponse): The parsed resume data.
    Returns:
        str: The generated LaTeX code.
    """
    try:
        # Generate LaTeX code using the ResumeParser
        response = CustomResumeBuilder.get_latex_code_from_pydantic_output(
            job_description, resume_data
        )
        latex_filepath = response["filepath"]
        pdf_filepath = CustomResumeBuilder.compile_latex_to_pdf(latex_filepath)
        
        # Schedule cleanup for after the response is sent
        background_tasks.add_task(CustomResumeBuilder.cleanup_latex_files, latex_filepath)
        
        # Return the PDF file as a blob
        with open(pdf_filepath, "rb") as pdf_file:
            pdf_content = pdf_file.read()
            
        return JSONResponse(
            content={"pdf": pdf_content.hex()},
            media_type="application/json"
        )
    except Exception as e:
        # Log the error
        print(f"Error generating LaTeX code: {str(e)}")
        # Return an error message that can be used in an HTTP response
        raise HTTPException(
            status_code=500, detail=f"Failed to generate LaTeX code: {str(e)}"
        )