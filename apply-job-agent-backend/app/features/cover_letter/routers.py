import os
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from app.core.dependencies import AuthenticatedUser, get_db
from sqlalchemy.orm import Session
from app.features.cover_letter.schemas import (
    CoverLetterRequest, 
    CoverLetterResponse, 
    CoverLetterPreviewResponse
)
from app.features.cover_letter.services import CoverLetterService
from app.features.resume.services import ResumeService
from fastapi.responses import JSONResponse, FileResponse
import uuid

router = APIRouter(prefix="/cover-letter", tags=["Cover Letter"])

@router.post(
    "/generate",
    response_model=CoverLetterPreviewResponse,
    summary="Generate a cover letter preview",
    description="Generate a cover letter based on user's resume and job description"
)
async def generate_cover_letter_preview(
    request: CoverLetterRequest,
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
) -> CoverLetterPreviewResponse:
    """
    Generate a cover letter preview based on the user's resume and job description.
    
    Args:
        request (CoverLetterRequest): Job description and other details
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
        
    Returns:
        CoverLetterPreviewResponse: Generated cover letter content
    """
    try:
        # Get the most recent resume data for the user
        resume_data = ResumeService.get_resume_data_from_db(current_user, db)
        
        # Generate cover letter content
        cover_letter_content = CoverLetterService.generate_cover_letter(
            resume_data=resume_data,
            job_description=request.job_description,
            company_name=request.company_name,
            position_title=request.position_title,
            hiring_manager_name=request.hiring_manager_name,
            additional_notes=request.additional_notes
        )
        
        return CoverLetterPreviewResponse(content=cover_letter_content)
    
    except Exception as e:
        # Log the error
        print(f"Error generating cover letter: {str(e)}")
        # Raise HTTP exception
        raise HTTPException(
            status_code=500, detail=f"Failed to generate cover letter: {str(e)}"
        )

@router.post(
    "/save",
    response_model=CoverLetterResponse,
    summary="Save a cover letter",
    description="Save a generated cover letter to the database"
)
async def save_cover_letter(
    request: CoverLetterRequest,
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
) -> CoverLetterResponse:
    """
    Save a generated cover letter to the database.
    
    Args:
        request (CoverLetterRequest): Job description and other details
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
        
    Returns:
        CoverLetterResponse: Saved cover letter information
    """
    try:
        # Get the most recent resume data for the user
        resume_data = ResumeService.get_resume_data_from_db(current_user, db)
        resume = db.query("Resume").filter("Resume.user_id" == current_user.id).order_by("Resume.created_at.desc()").first()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Generate cover letter content
        cover_letter_content = CoverLetterService.generate_cover_letter(
            resume_data=resume_data,
            job_description=request.job_description,
            company_name=request.company_name,
            position_title=request.position_title,
            hiring_manager_name=request.hiring_manager_name,
            additional_notes=request.additional_notes
        )
        
        # Save to database
        saved_cover_letter = CoverLetterService.store_cover_letter_in_db(
            cover_letter_content=cover_letter_content,
            job_description=request.job_description,
            resume_id=resume.id,
            current_user=current_user,
            db=db
        )
        
        return CoverLetterResponse(
            id=str(saved_cover_letter.id),
            content=saved_cover_letter.cover_letter_content,
            job_description=saved_cover_letter.job_description,
            created_at=saved_cover_letter.created_at
        )
        
    except Exception as e:
        # Log the error
        print(f"Error saving cover letter: {str(e)}")
        # Raise HTTP exception
        raise HTTPException(
            status_code=500, detail=f"Failed to save cover letter: {str(e)}"
        )

@router.get(
    "/download/{cover_letter_id}",
    summary="Download cover letter as PDF",
    description="Generate and download a cover letter as PDF"
)
async def download_cover_letter(
    cover_letter_id: str,
    background_tasks: BackgroundTasks,
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
):
    """
    Generate and download a cover letter as PDF.
    
    Args:
        cover_letter_id (str): ID of the cover letter to download
        background_tasks (BackgroundTasks): Background tasks for cleanup
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
        
    Returns:
        FileResponse: PDF file response
    """
    try:
        # Convert string ID to UUID
        try:
            cover_letter_uuid = uuid.UUID(cover_letter_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid cover letter ID format")
        
        # Retrieve cover letter from database
        cover_letter = CoverLetterService.get_cover_letter_by_id(
            cover_letter_id=cover_letter_uuid,
            current_user=current_user,
            db=db
        )
        
        # Generate PDF
        pdf_filepath = CoverLetterService.generate_cover_letter_pdf(cover_letter.cover_letter_content)
        
        # Schedule cleanup for after response is sent
        background_tasks.add_task(CoverLetterService.cleanup_files, pdf_filepath)
        
        # Return the PDF file
        return FileResponse(
            pdf_filepath, 
            media_type="application/pdf",
            filename=f"cover_letter_{cover_letter_id}.pdf"
        )
        
    except Exception as e:
        # Log the error
        print(f"Error downloading cover letter: {str(e)}")
        # Raise HTTP exception
        raise HTTPException(
            status_code=500, detail=f"Failed to download cover letter: {str(e)}"
        )

@router.get(
    "/list",
    response_model=list[CoverLetterResponse],
    summary="List user's cover letters",
    description="Get a list of all cover letters for the authenticated user"
)
async def list_cover_letters(
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
) -> list[CoverLetterResponse]:
    """
    Get a list of all cover letters for the authenticated user.
    
    Args:
        current_user (AuthenticatedUser): The authenticated user
        db (Session): Database session
        
    Returns:
        List[CoverLetterResponse]: List of cover letter information
    """
    try:
        # Get cover letters from database
        cover_letters = CoverLetterService.get_user_cover_letters(current_user, db)
        
        # Format response
        response = [
            CoverLetterResponse(
                id=str(cl.id),
                content=cl.cover_letter_content,
                job_description=cl.job_description,
                created_at=cl.created_at
            )
            for cl in cover_letters
        ]
        
        return response
        
    except Exception as e:
        # Log the error
        print(f"Error listing cover letters: {str(e)}")
        # Raise HTTP exception
        raise HTTPException(
            status_code=500, detail=f"Failed to list cover letters: {str(e)}"
        )