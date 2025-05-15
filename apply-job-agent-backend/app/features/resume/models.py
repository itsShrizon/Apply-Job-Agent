from sqlalchemy import Column, Integer, ForeignKey, JSON, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.base import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Resume(Base):
    """Model for storing user resumes."""
    
    __tablename__ = "resumes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    resume_data = Column(JSON, nullable=False)  # JSON column to store ResumeParseResponse
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship with User model (assuming you have one)
    user = relationship("User", back_populates="resumes")