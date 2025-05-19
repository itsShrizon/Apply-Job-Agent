from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EmploymentDates(BaseModel):
    start: Optional[str] = None
    end: Optional[str] = None

class WorkExperience(BaseModel):
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    employment_dates: Optional[EmploymentDates] = None
    location: Optional[str] = None
    responsibilities_achievements: Optional[List[str]] = None

class Education(BaseModel):
    degree_earned: Optional[str] = None
    field_of_study: Optional[str] = None
    institution_name: Optional[str] = None
    graduation_year: Optional[str] = None
    location: Optional[str] = None
    cgpa: Optional[str] = None
    gpa: Optional[str] = None

class Skills(BaseModel):
    technical_skills: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None
    certifications: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    hobbies: Optional[List[str]] = None
    awards: Optional[List[str]] = None
    volunteer_experience: Optional[List[str]] = None

class Project(BaseModel):
    project_name: Optional[str] = None
    description: Optional[str] = None
    technologies_used: Optional[List[str]] = None
    github_link: Optional[str] = None
    live_link: Optional[str] = None
    
class Certifications(BaseModel):
    certification_name: Optional[str] = None
    issuing_organization: Optional[str] = None
    issue_date: Optional[str] = None
    
class Publications(BaseModel):
    title: Optional[str] = None
    publication_date: Optional[str] = None
    journal_name: Optional[str] = None
    link: Optional[str] = None

class PersonalInformation(BaseModel):
    full_name: Optional[str] = None
    email_address: Optional[str] = None
    phone_number: Optional[str] = None
    location: Optional[str] = None
    linkedin_profile: Optional[str] = None
    github_profile: Optional[str] = None
    codeforces_profile: Optional[str] = None
    leetcode_profile: Optional[str] = None
    personal_website: Optional[str] = None
    portfolio: Optional[str] = None

class ResumeParseResponse(BaseModel):
    personal_information: Optional[PersonalInformation] = None
    professional_summary: Optional[str] = None
    work_experience: List[WorkExperience] = None
    work_experience_summary: Optional[str] = None
    education: List[Education] = None
    education_summary: Optional[str] = None
    certifications: Optional[List[Certifications]] = None
    publications: Optional[List[Publications]] = None
    skills: Optional[Skills] = None
    projects: Optional[List[Project]] = None
    
class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")
    
class CustomResumeRequest(BaseModel):
    job_description: str = Field(..., description="Job description for the resume")

class CoverLetterRequest(BaseModel):
    job_description: str = Field(..., description="Job description for the cover letter")
    company_name: str = Field(..., description="Name of the company")
    position_title: str = Field(..., description="Title of the position")
    hiring_manager_name: Optional[str] = Field(None, description="Name of the hiring manager")
    additional_details: Optional[str] = Field(None, description="Any additional details about the job or company")

class CoverLetterResponse(BaseModel):
    cover_letter_id: str = Field(..., description="Unique identifier for the cover letter")
    content: str = Field(..., description="Cover letter content")
    created_at: str = Field(..., description="Creation timestamp")

class ResumeWithCoverLetterRequest(BaseModel):
    job_description: str = Field(..., description="Job description for the resume and cover letter")
    company_name: str = Field(..., description="Name of the company")
    position_title: str = Field(..., description="Title of the position")
    hiring_manager_name: Optional[str] = Field(None, description="Name of the hiring manager")
    additional_details: Optional[str] = Field(None, description="Any additional details about the job or company")