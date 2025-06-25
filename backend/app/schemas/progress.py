from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime


class ProgressBase(BaseModel):
    subject: str
    topic: str
    mastery_level: float = 0.0
    study_time: int = 0
    last_studied: Optional[date] = None


class ProgressCreate(ProgressBase):
    pass


class ProgressUpdate(BaseModel):
    mastery_level: Optional[float] = None
    study_time: Optional[int] = None
    quiz_scores: Optional[List[float]] = None
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    last_studied: Optional[date] = None


class Progress(ProgressBase):
    id: int
    user_id: int
    quiz_scores: List[float]
    strengths: List[str]
    weaknesses: List[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_quizzes: int
    total_study_time: int
    average_score: float
    subjects_studied: int
    recent_activity: List[dict]
    progress_by_subject: List[dict]
    weekly_progress: List[dict]
