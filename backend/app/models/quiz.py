from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Float, Boolean
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Quiz(BaseModel):
    __tablename__ = "quizzes"
    
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    subject = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)  # easy, medium, hard
    questions = Column(JSON, nullable=False)  # List of question objects
    time_limit = Column(Integer, nullable=True)  # in minutes
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_ai_generated = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="quizzes")
    attempts = relationship("QuizAttempt", back_populates="quiz")


class QuizAttempt(BaseModel):
    __tablename__ = "quiz_attempts"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    answers = Column(JSON, nullable=False)  # User's answers
    score = Column(Float, nullable=False)
    time_taken = Column(Integer, nullable=False)  # in seconds
    completed = Column(Boolean, default=True)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="attempts")