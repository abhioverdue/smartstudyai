from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.progress import Progress
from app.schemas.progress import (
    Progress as ProgressSchema,
    ProgressCreate,
    ProgressUpdate,
    DashboardStats
)
from app.services.progress_service import ProgressService

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    progress_service = ProgressService(db)
    stats = await progress_service.get_dashboard_stats(current_user.id)
    return stats


@router.get("/", response_model=List[ProgressSchema])
async def get_progress(
    subject: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Progress).where(Progress.user_id == current_user.id)
    
    if subject:
        query = query.where(Progress.subject == subject)
    
    result = await db.execute(query)
    progress_records = result.scalars().all()
    
    return progress_records


@router.post("/", response_model=ProgressSchema)
async def create_progress(
    progress_data: ProgressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    progress = Progress(
        **progress_data.dict(),
        user_id=current_user.id
    )
    
    db.add(progress)
    await db.commit()
    await db.refresh(progress)
    
    return progress


@router.put("/{progress_id}", response_model=ProgressSchema)
async def update_progress(
    progress_id: int,
    progress_data: ProgressUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Progress).where(
            and_(Progress.id == progress_id, Progress.user_id == current_user.id)
        )
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress record not found")
    
    for field, value in progress_data.dict(exclude_unset=True).items():
        setattr(progress, field, value)
    
    await db.commit()
    await db.refresh(progress)
    
    return progress