# Apply Job Agent

An intelligent, AI-powered application platform that helps users upload resumes, find matching jobs, and create tailored, custom resumes for specific job applications.

## Overview

Apply Job Agent is a comprehensive platform that combines AI technology with job search functionalities to streamline the job application process. It helps job seekers find relevant positions based on their skills and experience, automatically customizes resumes for specific jobs, and simplifies the application process.

## Key Features

### Resume Management
- **Resume Parsing**: Upload and analyze PDF resumes to extract structured information
- **Smart Analysis**: AI-powered extraction of skills, experience, education, and qualifications
- **Data Storage**: Secure storage of resume information for future use

### Job Matching
- **Intelligent Job Search**: Find relevant jobs based on resume content and skills
- **Job Recommendations**: AI-powered job matching algorithm for high relevance
- **Job Details**: View comprehensive job information including descriptions, requirements, and benefits

### Custom Resume Generation
- **Resume Customization**: Automatically create tailored resumes for specific job applications
- **Professional Templates**: Multiple professional resume templates
- **ATS-Friendly**: Generate ATS-optimized resumes that pass applicant tracking systems
- **PDF Download**: Download custom resumes in PDF format

### User Management
- **User Registration**: Create and manage user accounts
- **Authentication**: Secure JWT-based authentication
- **Premium Features**: Access to additional premium features for subscribed users

## Technology Stack

### Backend
- **Framework**: FastAPI with Python 3.9+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT-based authentication
- **AI Integration**: LangChain + OpenAI models for resume parsing and job matching
- **Document Processing**: LaTeX + PDF generation tools
- **Containerization**: Docker + Docker Compose
- **Custom JobSpy**: Utilizes a custom version of the JobSpy library modified by Tanzir Hossain (https://github.com/itsShrizon/JobSpy)

### Frontend
- **Framework**: React with Vite build tool
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API
- **HTTP Client**: Axios for API communication
- **UI Components**: Custom components with responsive design
- **Routing**: React Router for navigation

## Project Structure

```
apply-job-agent/
├── apply-job-agent-backend/    # FastAPI backend
│   ├── app/
│   │   ├── core/               # Core application components
│   │   ├── features/           # Feature modules (auth, resume, jobs)
│   │   ├── shared/             # Shared components and utilities
│   │   └── main.py             # Application entry point
│   ├── alembic/                # Database migrations
│   └── docker-compose.yml      # Docker configuration
│
└── apply-job-agent-frontend/   # React frontend
    ├── src/
    │   ├── assets/             # Static assets
    │   ├── Contexts/           # React context providers
    │   ├── pages/              # Page components
    │   └── main.jsx            # Application entry point
    └── index.html              # HTML template
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Node.js 16+ and npm
- Python 3.9+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd apply-job-agent-backend
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start backend services:
   ```bash
   docker-compose up -d
   ```

4. Run database migrations:
   ```bash
   docker-compose exec api alembic upgrade head
   ```

5. The backend API will be available at:
   ```
   http://localhost:8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd apply-job-agent-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The frontend application will be available at:
   ```
   http://localhost:5173
   ```

## Usage Guide

### Resume Upload
1. Navigate to the Upload page
2. Select a PDF resume file
3. Submit the file for analysis

### Resume Analysis
The system will automatically extract:
- Personal information
- Skills and competencies
- Professional experience
- Educational background

### Job Search
1. View matched jobs based on your resume
2. Filter jobs by various criteria
3. View detailed job descriptions

### Custom Resume Generation
1. Select a job you want to apply for
2. Choose a resume template
3. Generate a custom tailored resume
4. Download the generated PDF

## API Documentation

API documentation is available when running the backend:
```
http://localhost:8000/docs
```

## License

All rights reserved. This project cannot be used for commercial use, distribution, or changing the license without explicit permission from Tanzir Hossain.

## Contact

For questions or support, please contact:
[Tanzir Hossain](mailto:shrizon.rex@gmail.com)
