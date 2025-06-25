from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.quiz import Quiz, QuizAttempt
from app.schemas.quiz import (
    Quiz as QuizSchema,
    QuizCreate,
    QuizGenerate,
    QuizAttempt as QuizAttemptSchema,
    QuizAttemptCreate
)
from app.services.quiz_service import QuizService
from app.services.ai_service import AIService

router = APIRouter()


@router.get("/", response_model=List[QuizSchema])
async def get_quizzes(
    skip: int = 0,
    limit: int = 100,
    subject: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Quiz).where(Quiz.user_id == current_user.id)
    
    if subject:
        query = query.where(Quiz.subject == subject)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    quizzes = result.scalars().all()
    
    return quizzes


@router.post("/", response_model=QuizSchema)
async def create_quiz(
    quiz_data: QuizCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = Quiz(
        **quiz_data.dict(),
        user_id=current_user.id,
        questions=[q.dict() for q in quiz_data.questions]
    )
    
    db.add(quiz)
    await db.commit()
    await db.refresh(quiz)
    
    return quiz


@router.post("/generate", response_model=QuizSchema)
async def generate_quiz(
    quiz_params: QuizGenerate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ai_service = AIService()
    quiz_service = QuizService(db)
    
    try:
        # Generate quiz using AI
        generated_quiz = await ai_service.generate_quiz(
            subject=quiz_params.subject,
            topic=quiz_params.topic,
            difficulty=quiz_params.difficulty,
            num_questions=quiz_params.num_questions
        )
        
        # Save to database
        quiz = Quiz(
            title=generated_quiz["title"],
            description=generated_quiz["description"],
            subject=quiz_params.subject,
            difficulty=quiz_params.difficulty,
            questions=generated_quiz["questions"],
            user_id=current_user.id,
            is_ai_generated=True
        )
        
        db.add(quiz)
        await db.commit()
        await db.refresh(quiz)
        
        return quiz
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}"
        )


@router.get("/{quiz_id}", response_model=QuizSchema)
async def get_quiz(
    quiz_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Quiz).where(
            and_(Quiz.id == quiz_id, Quiz.user_id == current_user.id)
        )
    )
    quiz = result.scalar_one_or_none()
    
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    return quiz


@router.post("/{quiz_id}/submit", response_model=QuizAttemptSchema)
async def submit_quiz(
    quiz_id: int,
    attempt_data: QuizAttemptCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get quiz
    result = await db.execute(select(Quiz).where(Quiz.id == quiz_id))
    quiz = result.scalar_one_or_none()
    
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    # Calculate score
    quiz_service = QuizService(db)
    score = await quiz_service.calculate_score(quiz, attempt_data.answers)
    
    # Save attempt
    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        answers=attempt_data.answers,
        score=score,
        time_taken=attempt_data.time_taken
    )
    
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    
    return attempt
