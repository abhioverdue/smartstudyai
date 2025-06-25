from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_premium = Column(Boolean, default=False, nullable=False)
    profile_picture = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Relationships
    quizzes = relationship("Quiz", back_populates="user")
    progress_records = relationship("Progress", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")

