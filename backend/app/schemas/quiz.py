from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: Optional[str] = None


class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject: str
    difficulty: str
    time_limit: Optional[int] = None


class QuizCreate(QuizBase):
    questions: List[QuizQuestion]


class QuizGenerate(BaseModel):
    subject: str
    topic: str
    difficulty: str = "medium"
    num_questions: int = 10
    question_types: List[str] = ["multiple_choice"]


class Quiz(QuizBase):
    id: int
    questions: List[Dict[str, Any]]
    user_id: int
    is_ai_generated: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuizAttemptCreate(BaseModel):
    quiz_id: int
    answers: List[int]
    time_taken: int


class QuizAttempt(BaseModel):
    id: int
    quiz_id: int
    answers: List[int]
    score: float
    time_taken: int
    completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True