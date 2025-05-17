from pydantic import BaseModel, Field

class GetJobsRequest(BaseModel):
    resume_information: dict = Field(description="Resume information extracted from the resume parser.")
    
class JobSearchInput(BaseModel):
    job_title: str = Field(description="The title of the search job.")
    location: str = Field(description="Personal location or address.")
    google_search_text: str = Field(description="The text to be used for Google search.")
    country: str = Field(description="The country of the user.")
    city: str = Field(description="The city of the user.")