from typing import Any, Optional
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password
from app.features.auth.models import User
from app.features.auth.schemas import CreateUser

def create_user(user_create: CreateUser, session: Session) -> User:
    """
    Create a new user in the database.
    
    This function takes user data, securely hashes the password, and stores
    the user information in the database.
    
    Args:
        user_create (CreateUser): Pydantic schema containing validated user data
        db (Session): SQLAlchemy database session
        
    Returns:
        User: The newly created user model instance with database ID
        
    Raises:
        SQLAlchemyError: If there's a database error during commit
    """
    # Create new user instance with hashed password
    new_user = User(
        email=user_create.email.lower(),  # Normalize email to lowercase
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        password=get_password_hash(user_create.password),
    )

    try:
        # Add and commit to database
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    except Exception as e:
        session.rollback()  # Rollback in case of error
        raise e
    
def authenticate(session, email: str, password: str) -> User | None:
    """
    Authenticates a user with the provided email and password.

    Args:
        session: The database session.
        email (str): The email of the user trying to authenticate.
        password (str): The password of the user trying to authenticate.

    Returns:
        User | None: The authenticated User object if credentials are valid, None otherwise.
            Returns None if:
            - No user exists with the provided email
            - The provided password does not match the stored password

    Note:
        This function verifies the password against the hashed password stored in the database.
    """
    db_user = get_user_by_email(session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.password):
        return None
    return db_user


def get_user_by_email(session, email: str) -> User | None:
    user = session.query(User).filter(User.email == email).first()
    if user:
        return user
    return None