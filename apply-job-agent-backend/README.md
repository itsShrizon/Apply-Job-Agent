# Apply Job Agent Backend

A FastAPI application that helps users manage their resumes, search for jobs, and create custom tailored resumes.

## Architecture Overview

This project follows a modular architecture designed for scalability and maintainability:

### Core Components

- **Core Module**: Foundation of the application with configuration, database connections, and security utilities
- **Feature-Based Organization**: Each domain area is isolated into feature modules
- **API Layer**: FastAPI routes exposing the application capabilities
- **Service Layer**: Business logic separate from the API endpoints
- **Data Layer**: Database models and schemas for data validation

### Technology Stack

- **Backend Framework**: FastAPI + Pydantic
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT-based authentication
- **Document Processing**: LaTeX + PDF tools
- **AI Integration**: LangChain + OpenAI models
- **Containerization**: Docker + Docker Compose

## Features

1. **Authentication System**
   - User registration and login
   - JWT token-based session management
   - Password security with hashing

2. **Resume Management**
   - Resume parsing from PDF documents
   - Structured storage of professional data
   - Resume retrieval and updates

3. **Resume Customization**
   - AI-powered resume tailoring
   - LaTeX template-based document generation
   - PDF compilation and delivery

4. **Job Search Integration**
   - Job search via external APIs
   - Intelligent job recommendations
   - Job filtering based on user preferences

## Project Structure

```
app/
├── core/               # Core application components
│   ├── base.py         # SQLAlchemy base
│   ├── config.py       # Settings and configuration
│   ├── dependencies.py # Dependency injection
│   ├── security.py     # Authentication utilities
│   └── session.py      # Database session management
│
├── features/           # Feature modules
│   ├── auth/           # Authentication feature
│   │   ├── models.py   # User models
│   │   ├── schemas.py  # Authentication schemas
│   │   ├── services.py # Auth business logic
│   │   └── routers.py  # Auth endpoints
│   │
│   ├── resume/         # Resume management
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── services.py
│   │   └── routers.py
│   │
│   └── jobs/           # Job search functionality
│       ├── models.py
│       ├── schemas.py
│       ├── services.py
│       └── routers.py
│
├── shared/             # Shared components
│   ├── llm/            # LLM integration
│   └── prompts/        # LLM prompts for various features
│
├── output/             # Generated output files
│
├── main.py             # Application entry point
```

## Setup and Installation

### Prerequisites

- Docker and Docker Compose
- Python 3.9+

### Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/apply-job-agent-backend.git
   cd apply-job-agent-backend
   ```

2. Create environment file
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the services
   ```bash
   docker-compose up -d
   ```

4. Run database migrations
   ```bash
   docker-compose exec api alembic upgrade head
   ```

5. Access the API documentation
   ```
   http://localhost:8000/docs
   ```

## API Endpoints

The API provides the following main endpoint groups:

- **Authentication**: `/api/auth/*` - User registration, login, token refresh
- **Resume Management**: `/api/resume/*` - Upload, retrieve and manage resumes
- **Resume Generation**: `/api/resume/generate/*` - Create custom tailored resumes
- **Job Search**: `/api/jobs/*` - Search for and filter job listings

## Database Migrations

We use Alembic for database migrations:

```bash
# Create a new migration
alembic revision -m "description_of_change"

# Apply migrations
alembic upgrade head

# Revert migrations
alembic downgrade -1
```

## Configuration

The application is configured through environment variables:

- `DATABASE_URL`: PostgreSQL connection URL
- `SECRET_KEY`: Secret key for JWT token generation
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `ALLOWED_ORIGINS`: CORS allowed origins

## License

MIT License