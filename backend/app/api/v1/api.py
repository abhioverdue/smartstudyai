from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, quiz, progress, tutor

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(tutor.router, prefix="/tutor", tags=["ai-tutor"])
