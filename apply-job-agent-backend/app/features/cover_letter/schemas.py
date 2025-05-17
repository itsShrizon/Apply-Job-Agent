from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CoverLetterRequest(BaseModel):
    job_description: str = Field(..., description="Job description for the cover letter")
    company_name: Optional[str] = Field(None, description="Name of the company")
    position_title: Optional[str] = Field(None, description="Title of the position")
    hiring_manager_name: Optional[str] = Field(None, description="Name of the hiring manager")
    additional_notes: Optional[str] = Field(None, description="Additional notes or requirements")

class CoverLetterResponse(BaseModel):
    id: str
    content: str
    job_description: str
    created_at: datetime
    
class CoverLetterPreviewResponse(BaseModel):
    content: str = Field(..., description="The generated cover letter content")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")