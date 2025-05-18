from sqlalchemy.orm import DeclarativeBase
from typing import Any

class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass

# Import models here so they are registered with Base:
from app.features.auth.models import *
from app.features.resume.models import *