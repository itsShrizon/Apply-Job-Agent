import os
from fastapi import APIRouter, UploadFile, Depends, BackgroundTasks, Form
from app.core.dependencies import AuthenticatedUser, get_db
from sqlalchemy.orm import Session
from app.features.resume.schemas import (
    CustomResumeRequest, 
    ResumeParseResponse, 
    CoverLetterRequest, 
    CoverLetterResponse,
    ResumeWithCoverLetterRequest
)
from app.features.resume.services import (
    CustomResumeBuilder, 
    ResumeService, 
    CoverLetterService,
    ResumeWithCoverLetterService
)
from fastapi.responses import JSONResponse, FileResponse
from fastapi import HTTPException
import pymupdf4llm
import shutil
from datetime import datetime
import base64

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

@router.post(
    "/generate-cover-letter",
    response_model=CoverLetterResponse,
    summary="Generate a cover letter",
    description="Generate a cover letter based on the user's resume and a job description"
)
async def generate_cover_letter(
    request: CoverLetterRequest,
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db),
    resume_data: ResumeParseResponse = Depends(get_resume_data)
) -> CoverLetterResponse:
    """
    Generate a cover letter based on the user's resume and job details.
    
    Args:
        request (CoverLetterRequest): The request containing job details
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
        resume_data (ResumeParseResponse): The parsed resume data
    
    Returns:
        CoverLetterResponse: The generated cover letter
    """
    try:
        # Generate the cover letter
        cover_letter_content = CoverLetterService.generate_cover_letter(
            resume_data=resume_data,
            job_description=request.job_description,
            company_name=request.company_name,
            position_title=request.position_title,
            hiring_manager_name=request.hiring_manager_name,
            additional_details=request.additional_details
        )
        
        # Store the cover letter in the database
        cover_letter = CoverLetterService.store_cover_letter_in_db(
            cover_letter_content=cover_letter_content,
            job_description=request.job_description,
            current_user=current_user,
            db=db
        )
        
        # Return the cover letter data
        return CoverLetterResponse(
            cover_letter_id=str(cover_letter.id),
            content=cover_letter.cover_letter_content,
            created_at=cover_letter.created_at.isoformat()
        )
    
    except Exception as e:
        # Log the error
        print(f"Error generating cover letter: {str(e)}")
        # Return an error message
        raise HTTPException(
            status_code=500, detail=f"Failed to generate cover letter: {str(e)}"
        )

@router.get(
    "/cover-letter/{cover_letter_id}",
    response_model=CoverLetterResponse,
    summary="Get a specific cover letter",
    description="Get a specific cover letter by ID"
)
async def get_cover_letter(
    cover_letter_id: str,
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
) -> CoverLetterResponse:
    """
    Get a specific cover letter by ID.
    
    Args:
        cover_letter_id (str): The ID of the cover letter
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
    
    Returns:
        CoverLetterResponse: The cover letter
    """
    try:
        # Get the cover letter from the database
        cover_letter = CoverLetterService.get_cover_letter_by_id(
            cover_letter_id=cover_letter_id,
            current_user=current_user,
            db=db
        )
        
        # Return the cover letter data
        return CoverLetterResponse(
            cover_letter_id=str(cover_letter.id),
            content=cover_letter.cover_letter_content,
            created_at=cover_letter.created_at.isoformat()
        )
    
    except Exception as e:
        # Log the error
        print(f"Error getting cover letter: {str(e)}")
        # Return an error message
        raise HTTPException(
            status_code=500, detail=f"Failed to get cover letter: {str(e)}"
        )

@router.get(
    "/download-cover-letter/{cover_letter_id}",
    summary="Download a cover letter as PDF",
    description="Download a specific cover letter as a PDF"
)
async def download_cover_letter(
    cover_letter_id: str,
    background_tasks: BackgroundTasks,
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
):
    """
    Download a specific cover letter as a PDF.
    
    Args:
        cover_letter_id (str): The ID of the cover letter
        background_tasks (BackgroundTasks): Background tasks for file cleanup
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
    
    Returns:
        FileResponse: The cover letter PDF file
    """
    try:
        # Get the cover letter from the database
        cover_letter = CoverLetterService.get_cover_letter_by_id(
            cover_letter_id=cover_letter_id,
            current_user=current_user,
            db=db
        )
        
        # Format the cover letter for PDF
        result = CoverLetterService.format_cover_letter_for_pdf(cover_letter.cover_letter_content)
        latex_filepath = result["filepath"]
        
        # Compile the LaTeX to PDF
        pdf_filepath = CustomResumeBuilder.compile_latex_to_pdf(latex_filepath)
        
        # Schedule cleanup for after the response is sent
        background_tasks.add_task(CustomResumeBuilder.cleanup_latex_files, latex_filepath)
        
        # Return the PDF file
        with open(pdf_filepath, "rb") as pdf_file:
            pdf_content = pdf_file.read()
            
        return JSONResponse(
            content={"pdf": pdf_content.hex()},
            media_type="application/json"
        )
    
    except Exception as e:
        # Log the error
        print(f"Error downloading cover letter: {str(e)}")
        # Return an error message
        raise HTTPException(
            status_code=500, detail=f"Failed to download cover letter: {str(e)}"
        )

@router.post(
    "/build-resume-with-cover-letter",
    summary="Generate a custom resume with a cover letter",
    description="Generate a custom resume with a cover letter based on job description"
)
async def build_resume_with_cover_letter(
    request: ResumeWithCoverLetterRequest,
    background_tasks: BackgroundTasks,
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db),
    resume_data: ResumeParseResponse = Depends(get_resume_data)
):
    """
    Generate a custom resume with a cover letter based on the job description.
    
    Args:
        request (ResumeWithCoverLetterRequest): The request containing job details
        background_tasks (BackgroundTasks): Background tasks for file cleanup
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
        resume_data (ResumeParseResponse): The parsed resume data
    
    Returns:
        JSONResponse: Contains the combined PDF file
    """
    try:
        # Generate the resume and cover letter
        result = ResumeWithCoverLetterService.generate_resume_with_cover_letter(
            resume_data=resume_data,
            job_description=request.job_description,
            company_name=request.company_name,
            position_title=request.position_title,
            hiring_manager_name=request.hiring_manager_name,
            additional_details=request.additional_details
        )
        
        resume_pdf_filepath = result["resume_pdf_filepath"]
        cover_letter_pdf_filepath = result["cover_letter_pdf_filepath"]
        cover_letter_content = result["cover_letter_content"]
        
        # Store the cover letter in the database
        CoverLetterService.store_cover_letter_in_db(
            cover_letter_content=cover_letter_content,
            job_description=request.job_description,
            current_user=current_user,
            db=db
        )
        
        # Combine the PDFs
        combined_pdf_filepath = ResumeWithCoverLetterService.combine_pdfs(
            resume_pdf_filepath=resume_pdf_filepath,
            cover_letter_pdf_filepath=cover_letter_pdf_filepath
        )
        
        # Schedule cleanup for after the response is sent
        background_tasks.add_task(os.remove, resume_pdf_filepath)
        background_tasks.add_task(os.remove, cover_letter_pdf_filepath)
        
        # Return the combined PDF file
        with open(combined_pdf_filepath, "rb") as pdf_file:
            pdf_content = pdf_file.read()
        
        # Schedule cleanup for the combined PDF
        background_tasks.add_task(os.remove, combined_pdf_filepath)
        
        return JSONResponse(
            content={"pdf": pdf_content.hex()},
            media_type="application/json"
        )
    
    except Exception as e:
        # Log the error
        print(f"Error building resume with cover letter: {str(e)}")
        # Return an error message
        raise HTTPException(
            status_code=500, detail=f"Failed to build resume with cover letter: {str(e)}"
        )

@router.get(
    "/cover-letters",
    summary="Get all cover letters",
    description="Get all cover letters for the authenticated user"
)
async def get_cover_letters(
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
):
    """
    Get all cover letters for the authenticated user.
    
    Args:
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
    
    Returns:
        list: List of cover letters
    """
    try:
        # Get all cover letters from the database
        cover_letters = CoverLetterService.get_cover_letters_for_user(
            current_user=current_user,
            db=db
        )
        
        # Format the response
        response = []
        for cover_letter in cover_letters:
            response.append({
                "id": str(cover_letter.id),
                "content_preview": cover_letter.cover_letter_content[:100] + "...",
                "created_at": cover_letter.created_at.isoformat(),
                "job_description_preview": cover_letter.job_description[:100] + "..."
            })
        
        return response
    
    except Exception as e:
        # Log the error
        print(f"Error getting cover letters: {str(e)}")
        # Return an error message
        raise HTTPException(
            status_code=500, detail=f"Failed to get cover letters: {str(e)}"
        )