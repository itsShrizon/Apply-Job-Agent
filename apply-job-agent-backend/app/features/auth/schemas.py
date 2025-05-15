from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class CreateUser(BaseModel):
    # user_id: str = Field(description="The unique identifier for the user.")
    first_name: str = Field(description="The first name of the user.")
    last_name: str = Field(description="The last name of the user.")
    email: str = Field(description="The email address of the user.")
    password: str = Field(description="The password of the user.")
    
class LoginUser(BaseModel):
    email: str = Field(description="The email address of the user.")
    password: str = Field(description="The password of the user.")
    
# Contents of JWT token
class TokenPayload(BaseModel):
    sub: str = Field(description="Subject (user ID)")
    exp: int = Field(description="Expiration timestamp")
    
class Token(BaseModel):
    access_token: str = Field(description="The access token for the user.")
    token_type: str = Field(description="The type of the token.")
    first_name: str = Field(description="The first name of the user.")
    last_name: str = Field(description="The last name of the user.")
    email: str = Field(description="The email address of the user.")

# User response model for API
class UserResponse(BaseModel):
    id: UUID = Field(description="The unique identifier for the user.")
    first_name: str = Field(description="The first name of the user.")
    last_name: str = Field(description="The last name of the user.")
    email: str = Field(description="The email address of the user.")
    created_at: Optional[str] = Field(None, description="The creation date of the user account.")
    
    class Config:
        from_attributes = True