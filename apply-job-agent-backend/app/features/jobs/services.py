from fastapi import HTTPException
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from app.features.jobs.schemas import JobSearchInput
from jobspy import scrape_jobs
from jobspy.model import Country
from app.shared.llm.llm_model import gpt_model
import pandas as pd

class JobService:
    @staticmethod
    def get_job_search_input(resume_information):
        try:
            with open("app/shared/prompts/job_search_input.md", "r") as file:
                prompt = file.read()
                
            # Output parser for the LLM
            parser = PydanticOutputParser(pydantic_object=JobSearchInput)
                
            # Create a prompt template
            prompt_template = PromptTemplate(
                template=prompt,
                input_variables=["resume_information", "Country"],
                partial_variables={"format_instructions": parser.get_format_instructions()}
            )
            
            # Create the chain
            chain = prompt_template | gpt_model | parser
            
            # Convert country enum to list
            country_list = [name for name, member in Country.__members__.items()]
            
            # Get response
            response = chain.invoke({'resume_information': resume_information, 'Country': country_list})
            
            return response
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read job search input template: {str(e)}")
        
    @staticmethod
    def get_jobs(input: JobSearchInput):
        try:
            jobs = scrape_jobs(
                    site_name=["indeed", "linkedin"],
                    search_term=input.job_title,
                    location=input.location,
                    results_wanted=7,
                    hours_old=72,
                    country_indeed=input.country,
                    
                    linkedin_fetch_description=True # gets more info such as description, direct job url (slower)
                    # proxies=["208.195.175.46:65095", "208.195.175.45:65095", "localhost"],
                )
            
            # Initialize an empty list to store job data
            job_list = []
            # Iterate through each job in the scraped jobs dataframe
            for index, job in jobs.iterrows():
                # Clean and prepare job data for JSON serialization
                job_data = {
                    "title": str(job["title"]) if not pd.isna(job["title"]) else "",
                    "site": str(job["site"]) if not pd.isna(job["site"]) else "",
                    "company": str(job["company"]) if not pd.isna(job["company"]) else "",
                    "location": str(job["location"]) if not pd.isna(job["location"]) else "",
                    "description": str(job["description"]) if not pd.isna(job["description"]) else "",
                    "url": str(job["job_url"]) if not pd.isna(job["job_url"]) else "",
                }
                
                # Append the sanitized job data
                job_list.append(job_data)
                
            # Return the list of formatted job data
            return job_list
        
        except Exception as e:
            import traceback
            print(f"Error in get_jobs: {str(e)}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Failed to get jobs: {str(e)}")