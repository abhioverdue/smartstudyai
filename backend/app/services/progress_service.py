from datetime import datetime, timedelta
from typing import Dict, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.models.quiz import Quiz, QuizAttempt
from app.models.progress import Progress
from app.schemas.progress import DashboardStats


class ProgressService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_dashboard_stats(self, user_id: int) -> DashboardStats:
        """Get comprehensive dashboard statistics"""
        
        # Total quizzes taken
        quiz_count = await self.db.execute(
            select(func.count(QuizAttempt.id)).where(QuizAttempt.user_id == user_id)
        )
        total_quizzes = quiz_count.scalar() or 0
        
        # Total study time
        study_time = await self.db.execute(
            select(func.sum(Progress.study_time)).where(Progress.user_id == user_id)
        )
        total_study_time = study_time.scalar() or 0
        
        # Average score
        avg_score = await self.db.execute(
            select(func.avg(QuizAttempt.score)).where(QuizAttempt.user_id == user_id)
        )
        average_score = round(avg_score.scalar() or 0.0, 2)
        
        # Subjects studied
        subjects = await self.db.execute(
            select(func.count(func.distinct(Progress.subject))).where(Progress.user_id == user_id)
        )
        subjects_studied = subjects.scalar() or 0
        
        # Recent activity (last 7 days)
        seven_days_ago = datetime.now() - timedelta(days=7)
        recent_attempts = await self.db.execute(
            select(QuizAttempt, Quiz.title, Quiz.subject)
            .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
            .where(
                and_(
                    QuizAttempt.user_id == user_id,
                    QuizAttempt.created_at >= seven_days_ago
                )
            )
            .order_by(QuizAttempt.created_at.desc())
            .limit(10)
        )
        
        recent_activity = []
        for attempt, title, subject in recent_attempts:
            recent_activity.append({
                "type": "quiz_completed",
                "title": title,
                "subject": subject,
                "score": attempt.score,
                "date": attempt.created_at.isoformat()
            })
        
        # Progress by subject
        progress_by_subject = await self.db.execute(
            select(
                Progress.subject,
                func.avg(Progress.mastery_level).label('avg_mastery'),
                func.sum(Progress.study_time).label('total_time')
            )
            .where(Progress.user_id == user_id)
            .group_by(Progress.subject)
        )
        
        subject_progress = []
        for subject, mastery, time in progress_by_subject:
            subject_progress.append({
                "subject": subject,
                "mastery_level": round(mastery or 0.0, 2),
                "study_time": time or 0
            })
        
        # Weekly progress (last 4 weeks)
        weekly_data = []
        for i in range(4):
            week_start = datetime.now() - timedelta(days=(i+1)*7)
            week_end = datetime.now() - timedelta(days=i*7)
            
            week_attempts = await self.db.execute(
                select(func.count(QuizAttempt.id), func.avg(QuizAttempt.score))
                .where(
                    and_(
                        QuizAttempt.user_id == user_id,
                        QuizAttempt.created_at >= week_start,
                        QuizAttempt.created_at < week_end
                    )
                )
            )
            
            count, avg_score = week_attempts.first()
            weekly_data.append({
                "week": f"Week {4-i}",
                "quizzes_completed": count or 0,
                "average_score": round(avg_score or 0.0, 2)
            })
        
        return DashboardStats(
            total_quizzes=total_quizzes,
            total_study_time=total_study_time,
            average_score=average_score,
            subjects_studied=subjects_studied,
            recent_activity=recent_activity,
            progress_by_subject=subject_progress,
            weekly_progress=weekly_data
        )