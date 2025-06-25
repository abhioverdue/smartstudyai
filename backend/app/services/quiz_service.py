from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.quiz import Quiz


class QuizService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def calculate_score(self, quiz: Quiz, user_answers: List[int]) -> float:
        """Calculate quiz score based on correct answers"""
        if not quiz.questions or not user_answers:
            return 0.0
        
        correct_answers = 0
        total_questions = len(quiz.questions)
        
        for i, question in enumerate(quiz.questions):
            if i < len(user_answers):
                correct_answer_index = question.get("correct_answer", 0)
                if user_answers[i] == correct_answer_index:
                    correct_answers += 1
        
        return (correct_answers / total_questions) * 100.0 if total_questions > 0 else 0.0
    
    async def get_quiz_analytics(self, quiz_id: int, user_id: int) -> dict:
        """Get detailed analytics for a quiz"""
        # Implementation for quiz analytics
        pass