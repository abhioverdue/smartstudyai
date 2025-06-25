from sqlalchemy import Boolean, Column, String, Integer, ForeignKey, JSON, Float, Date
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Progress(BaseModel):
    __tablename__ = "progress"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    mastery_level = Column(Float, default=0.0)  # 0.0 to 1.0
    study_time = Column(Integer, default=0)  # in minutes
    quiz_scores = Column(JSON, default=list)  # List of recent scores
    strengths = Column(JSON, default=list)  # List of strong topics
    weaknesses = Column(JSON, default=list)  # List of weak topics
    last_studied = Column(Date, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="progress_records")


class ChatSession(BaseModel):
    __tablename__ = "chat_sessions"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    subject = Column(String, nullable=True)
    messages = Column(JSON, default=list)  # List of message objects
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="chat_sessions")

