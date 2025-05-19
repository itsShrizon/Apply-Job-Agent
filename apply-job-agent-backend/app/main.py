"""
Main application entry point for the Apply Job Agent API.

This module initializes the FastAPI application, sets up CORS middleware,
configures OpenAPI documentation, and includes all API routers.
"""
# Standard library imports
import os

# Third-party imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
import uvicorn

# Application imports
from app.core.config import settings
from app.features.resume.routers import router as resume_router
# from app.features.cover_letter.routers import router as cover_letter_router
from app.features.jobs.routers import router as jobs_router
from app.features.auth.routers import router as auth_router
from dotenv import load_dotenv
load_dotenv()

def custom_openapi(app: FastAPI):
    """
    Generate custom OpenAPI schema with security definitions.
    
    This adds JWT Bearer authentication to all endpoints except login and signup.
    """
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    # Add Bearer security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    
    # Apply security to all operations except auth endpoints
    for path in openapi_schema["paths"].values():
        for operation in path.values():
            # Skip security for login and signup endpoints
            operation_id = operation.get("operationId", "")
            if "auth/login" not in operation_id and "auth/signup" not in operation_id:
                operation["security"] = [{"bearerAuth": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""
    application = FastAPI(
        title="Apply Job Agent API",
        description="API for Apply Job Agent - Automated job application assistant.",
        version="0.1",
        swagger_ui_parameters={"persistAuthorization": True},
    )
    
    # Configure CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Configure custom OpenAPI documentation with security
    application.openapi = lambda: custom_openapi(application)
    
    # Root endpoint
    @application.get("/")
    def root():
        """Root endpoint returning a welcome message."""
        return {"message": "Welcome to the Apply Job Agent API"}
    
    # Include routers from different features
    application.include_router(resume_router)
    # application.include_router(cover_letter_router)
    application.include_router(jobs_router)
    application.include_router(auth_router)
    
    return application


# Create the FastAPI application instance
app = create_application()


if __name__ == "__main__":
    """Run the application when executed directly."""
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )