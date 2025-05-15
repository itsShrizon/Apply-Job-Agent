from collections.abc import Generator
from typing import Annotated, Optional
import jwt
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.security import ALGORITHM
from app.core.config import settings
from app.core.session import SessionLocal
from app.features.auth.models import User
from app.features.auth.schemas import TokenPayload

# Create OAuth2 password bearer scheme that will work with Swagger UI
# The tokenUrl should match exactly with the path in your router
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",  # Must include the leading slash to match the actual endpoint path
    scheme_name="JWT"  # Name displayed in Swagger UI
)

# Alternative security scheme for more flexibility
security = HTTPBearer()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency for getting a database session.
    
    Yields:
        Session: SQLAlchemy session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Type annotations for common dependencies
SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]

def get_current_user(
    session: SessionDep, 
    token: TokenDep
) -> User:
    """
    Verify token and return current user.
    
    Args:
        session: Database session
        token: JWT token from OAuth2 bearer
        
    Returns:
        User: The authenticated user
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    try:
        # Decode the JWT token
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        # Validate token data
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = session.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return user

# Dependency for getting current authenticated user
# This is a type alias for use in route function parameters
AuthenticatedUser = Annotated[User, Depends(get_current_user)]