import datetime
from typing import Any
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import create_access_token
from app.core.dependencies import get_db, AuthenticatedUser
from app.features.auth.models import User
from app.features.auth.schemas import *
from app.features.auth import services

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post(
    "/signup", 
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
    summary="Create new user account",
    description="Register a new user account and return access token for authentication."
)
async def register_user(
    user_create: CreateUser,
    session: Session = Depends(get_db)
) -> Token:
    # Check if user with this email already exists
    existing_user = services.get_user_by_email(session, email=user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create the user in database
    try:
        user = services.create_user(user_create, session)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )
    
    # Generate access token
    token = create_access_token(
        user.id,
        expires_delta=datetime.timedelta(days=7),  # Set 1 week expiration
    )
    
    # Prepare response
    return Token(
        access_token=token,
        token_type="bearer",
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    
@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="User login with OAuth2 support",
    description="Authenticate user and return access token with OAuth2 format."
)
async def login(
    loginUser: LoginUser,
    session: Session = Depends(get_db)
) -> Token:
    """
    Authenticate user and return access token.
    
    This endpoint is compatible with OAuth2 password flow used by Swagger UI.
    
    Args:
        loginUser: User credentials containing email and password
        session: Database session dependency
        
    Returns:
        Token: Authentication token and user information
    """
    # Authenticate the user
    user = services.authenticate(
        session,
        email=loginUser.email,
        password=loginUser.password,
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Generate access token
    access_token = create_access_token(
        user.id,
        expires_delta=datetime.timedelta(days=7),  # Set 1 week expiration
    )
    
    # Return token with user information
    return Token(
        access_token=access_token,
        token_type="bearer",
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    
@router.get(
    "/current-user",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user information",
    description="Retrieve current user information based on JWT token."
)
async def get_current_user(
    current_user: AuthenticatedUser,
) -> UserResponse:
    """
    Get the current authenticated user based on the JWT token.
    
    Args:
        current_user: User obtained from the AuthenticatedUser dependency
        
        
    Returns:
        UserResponse: The authenticated user
    """
    return UserResponse(
        id=current_user.id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        created_at=str(current_user.created_at) if current_user.created_at else None
    )
