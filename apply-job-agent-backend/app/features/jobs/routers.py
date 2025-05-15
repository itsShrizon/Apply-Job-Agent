from fastapi import APIRouter, HTTPException, Depends
from app.features.jobs.schemas import *
from app.features.jobs.services import JobService
from app.core.dependencies import AuthenticatedUser, get_db
from app.features.resume.services import ResumeService
from sqlalchemy.orm import Session

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/get-jobs")
async def get_jobs(
    current_user: AuthenticatedUser,
    db: Session = Depends(get_db)
):
    try:
        # Get the resume information from the authenticated user
        resume_information = ResumeService.get_resume_data_from_db(current_user, db)
        
        # Check if resume information is available
        if not resume_information:
            raise HTTPException(status_code=404, detail="Resume information not found")
        
        # Call the service to get job search input with the new parameters
        job_search_input = JobService.get_job_search_input(
           resume_information,
        )
        
        # Get jobs using the job search input
        jobs = JobService.get_jobs(job_search_input)
        
        # Return the response
        return jobs
    
    except Exception as e:
        # Handle exceptions and return an error response
        raise HTTPException(status_code=500, detail=f"Failed to get jobs: {str(e)}")