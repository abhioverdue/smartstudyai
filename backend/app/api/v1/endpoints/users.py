# backend/app/api/v1/endpoints/users.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import (
    User as UserSchema,
    UserUpdate,
    UserInDB
)
from app.core.security import get_password_hash, verify_password

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user's profile"""
    return current_user


@router.put("/me", response_model=UserSchema)
async def update_current_user(
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update current user's profile"""
    
    # Update only provided fields
    for field, value in user_update.dict(exclude_unset=True).items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


@router.get("/{user_id}", response_model=UserSchema)
async def get_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user by ID (for admin or public profiles)"""
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.delete("/me")
async def delete_current_user(
    password: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete current user account (requires password confirmation)"""
    
    # Verify password before deletion
    if not verify_password(password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )
    
    # Soft delete - deactivate user instead of hard delete
    current_user.is_active = False
    
    await db.commit()
    
    return {"message": "User account deactivated successfully"}


@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change user password"""
    
    # Verify current password
    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Validate new password length
    if len(new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long"
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(new_password)
    
    await db.commit()
    
    return {"message": "Password updated successfully"}


@router.get("/", response_model=List[UserSchema])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of users (for admin purposes or public directory)"""
    
    # Simple implementation - in production, add proper admin checks
    query = select(User).where(User.is_active == True).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    
    return users


@router.post("/upgrade-premium")
async def upgrade_to_premium(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upgrade user to premium (placeholder for payment integration)"""
    
    if current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already premium"
        )
    
    # In production, integrate with payment processor
    # For now, just set the flag
    current_user.is_premium = True
    
    await db.commit()
    
    return {"message": "Successfully upgraded to premium", "is_premium": True}


@router.get("/stats/summary")
async def get_user_stats_summary(
    current_user: User = Depends(get_current_user)
):
    """Get basic user statistics summary"""
    
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "is_premium": current_user.is_premium,
        "member_since": current_user.created_at,
        "profile_complete": bool(current_user.bio and current_user.profile_picture)
    }
