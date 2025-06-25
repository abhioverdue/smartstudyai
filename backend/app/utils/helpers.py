import re
import uuid
import hashlib
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
import json


def generate_unique_id() -> str:
    """Generate a unique ID"""
    return str(uuid.uuid4())


def generate_short_id(length: int = 8) -> str:
    """Generate a short unique ID"""
    return str(uuid.uuid4()).replace('-', '')[:length]


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password: str) -> Dict[str, Any]:
    """Validate password strength"""
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one digit")
    
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        errors.append("Password must contain at least one special character")
    
    return {
        "is_valid": len(errors) == 0,
        "errors": errors,
        "strength": calculate_password_strength(password)
    }


def calculate_password_strength(password: str) -> str:
    """Calculate password strength"""
    score = 0
    
    # Length
    if len(password) >= 8:
        score += 1
    if len(password) >= 12:
        score += 1
    
    # Character types
    if re.search(r'[a-z]', password):
        score += 1
    if re.search(r'[A-Z]', password):
        score += 1
    if re.search(r'\d', password):
        score += 1
    if re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        score += 1
    
    # Complexity
    if len(set(password)) > len(password) * 0.7:  # Character diversity
        score += 1
    
    if score <= 2:
        return "weak"
    elif score <= 4:
        return "medium"
    else:
        return "strong"


def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    # Remove/replace unsafe characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Remove leading/trailing spaces and dots
    filename = filename.strip(' .')
    # Limit length
    if len(filename) > 255:
        name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
        filename = name[:250] + ('.' + ext if ext else '')
    
    return filename


def format_duration(seconds: int) -> str:
    """Format duration in seconds to human readable format"""
    if seconds < 60:
        return f"{seconds}s"
    elif seconds < 3600:
        minutes = seconds // 60
        secs = seconds % 60
        return f"{minutes}m {secs}s" if secs > 0 else f"{minutes}m"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        return f"{hours}h {minutes}m" if minutes > 0 else f"{hours}h"


def calculate_reading_time(text: str, words_per_minute: int = 200) -> int:
    """Calculate estimated reading time in minutes"""
    word_count = len(text.split())
    return max(1, round(word_count / words_per_minute))


def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """Truncate text to specified length"""
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix


def generate_slug(text: str) -> str:
    """Generate URL-friendly slug from text"""
    # Convert to lowercase and replace spaces/special chars with hyphens
    slug = re.sub(r'[^\w\s-]', '', text.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """Calculate percentage change between two values"""
    if old_value == 0:
        return 100.0 if new_value > 0 else 0.0
    return ((new_value - old_value) / old_value) * 100


def group_by_date(items: List[Dict], date_key: str = 'created_at') -> Dict[str, List[Dict]]:
    """Group items by date"""
    grouped = {}
    for item in items:
        date = item[date_key]
        if isinstance(date, datetime):
            date_str = date.strftime('%Y-%m-%d')
        else:
            date_str = str(date)[:10]  # Assume ISO format
        
        if date_str not in grouped:
            grouped[date_str] = []
        grouped[date_str].append(item)
    
    return grouped


def calculate_streak(dates: List[datetime]) -> int:
    """Calculate current streak from list of dates"""
    if not dates:
        return 0
    
    # Sort dates in descending order
    sorted_dates = sorted(dates, reverse=True)
    
    # Check if the most recent date is today or yesterday
    today = datetime.now().date()
    most_recent = sorted_dates[0].date()
    
    if most_recent < today - timedelta(days=1):
        return 0  # Streak broken
    
    streak = 1
    current_date = most_recent
    
    for i in range(1, len(sorted_dates)):
        prev_date = sorted_dates[i].date()
        if current_date - prev_date == timedelta(days=1):
            streak += 1
            current_date = prev_date
        else:
            break
    
    return streak


def generate_avatar_url(email: str, size: int = 200) -> str:
    """Generate Gravatar URL for email"""
    hash_email = hashlib.md5(email.lower().encode()).hexdigest()
    return f"https://www.gravatar.com/avatar/{hash_email}?s={size}&d=identicon"


def safe_json_loads(json_str: str, default: Any = None) -> Any:
    """Safely load JSON string"""
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default


def safe_json_dumps(obj: Any, default: str = "{}") -> str:
    """Safely dump object to JSON string"""
    try:
        return json.dumps(obj, default=str)
    except (TypeError, ValueError):
        return default


class DateTimeHelper:
    @staticmethod
    def get_week_start(date: datetime = None) -> datetime:
        """Get the start of the week (Monday) for given date"""
        if date is None:
            date = datetime.now()
        return date - timedelta(days=date.weekday())
    
    @staticmethod
    def get_month_start(date: datetime = None) -> datetime:
        """Get the start of the month for given date"""
        if date is None:
            date = datetime.now()
        return date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    @staticmethod
    def get_time_ago(date: datetime) -> str:
        """Get human-readable time ago string"""
        now = datetime.now()
        diff = now - date
        
        if diff.days > 365:
            years = diff.days // 365
            return f"{years} year{'s' if years > 1 else ''} ago"
        elif diff.days > 30:
            months = diff.days // 30
            return f"{months} month{'s' if months > 1 else ''} ago"
        elif diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "just now"


# backend/app/api/v1/endpoints/users.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate
from app.services.auth_service import AuthService
from app.utils.helpers import validate_email, sanitize_filename, generate_avatar_url
import shutil
import os
from pathlib import Path

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=UserSchema)
async def update_current_user(
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update current user profile"""
    # Update fields
    for field, value in user_update.dict(exclude_unset=True).items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload user avatar"""
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
        )
    
    # Validate file size (max 5MB)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    
    if file_size > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size too large. Maximum size is 5MB."
        )
    
    # Create uploads directory if it doesn't exist
    upload_dir = Path("uploads/avatars")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    filename = f"{current_user.id}_{int(datetime.now().timestamp())}.{file_extension}"
    filename = sanitize_filename(filename)
    file_path = upload_dir / filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Update user profile picture URL
        avatar_url = f"/uploads/avatars/{filename}"
        current_user.profile_picture = avatar_url
        
        await db.commit()
        await db.refresh(current_user)
        
        return {"message": "Avatar uploaded successfully", "avatar_url": avatar_url}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload avatar: {str(e)}"
        )


@router.delete("/me/avatar")
async def delete_avatar(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete user avatar"""
    if current_user.profile_picture:
        # Remove file if it exists
        if current_user.profile_picture.startswith('/uploads/'):
            file_path = Path(current_user.profile_picture[1:])  # Remove leading slash
            if file_path.exists():
                file_path.unlink()
        
        # Clear from database
        current_user.profile_picture = None
        await db.commit()
        await db.refresh(current_user)
    
    return {"message": "Avatar deleted successfully"}


@router.get("/me/stats")
async def get_user_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user statistics"""
    from app.models.quiz import QuizAttempt
    from app.models.progress import Progress
    
    # Get quiz stats
    quiz_attempts = await db.execute(
        select(QuizAttempt).where(QuizAttempt.user_id == current_user.id)
    )
    attempts = quiz_attempts.scalars().all()
    
    # Get progress stats
    progress_records = await db.execute(
        select(Progress).where(Progress.user_id == current_user.id)
    )
    progress = progress_records.scalars().all()
    
    # Calculate stats
    total_quizzes = len(attempts)
    total_study_time = sum(p.study_time for p in progress)
    average_score = sum(a.score for a in attempts) / len(attempts) if attempts else 0
    subjects_count = len(set(p.subject for p in progress))
    
    # Get recent activity
    recent_attempts = sorted(attempts, key=lambda x: x.created_at, reverse=True)[:5]
    recent_activity = [
        {
            "type": "quiz_completed",
            "score": attempt.score,
            "date": attempt.created_at.isoformat()
        }
        for attempt in recent_attempts
    ]
    
    return {
        "total_quizzes": total_quizzes,
        "total_study_time": total_study_time,
        "average_score": round(average_score, 2),
        "subjects_count": subjects_count,
        "recent_activity": recent_activity,
        "member_since": current_user.created_at.isoformat(),
        "is_premium": current_user.is_premium
    }


@router.post("/me/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change user password"""
    from app.core.security import verify_password, get_password_hash
    from app.utils.helpers import validate_password
    
    # Verify current password
    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    password_validation = validate_password(new_password)
    if not password_validation["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Password validation failed", "errors": password_validation["errors"]}
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"}


@router.delete("/me")
async def delete_account(
    password: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete user account"""
    from app.core.security import verify_password
    
    # Verify password
    if not verify_password(password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is incorrect"
        )
    
    # Soft delete - deactivate account
    current_user.is_active = False
    await db.commit()
    
    return {"message": "Account deactivated successfully"}


@router.get("/me/export")
async def export_user_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Export user data"""
    from app.models.quiz import Quiz, QuizAttempt
    from app.models.progress import Progress, ChatSession
    
    # Get all user data
    quizzes = await db.execute(
        select(Quiz).where(Quiz.user_id == current_user.id)
    )
    user_quizzes = quizzes.scalars().all()
    
    attempts = await db.execute(
        select(QuizAttempt).where(QuizAttempt.user_id == current_user.id)
    )
    user_attempts = attempts.scalars().all()
    
    progress = await db.execute(
        select(Progress).where(Progress.user_id == current_user.id)
    )
    user_progress = progress.scalars().all()
    
    chats = await db.execute(
        select(ChatSession).where(ChatSession.user_id == current_user.id)
    )
    user_chats = chats.scalars().all()
    
    # Prepare export data
    export_data = {
        "user_profile": {
            "username": current_user.username,
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "bio": current_user.bio,
            "member_since": current_user.created_at.isoformat(),
            "is_premium": current_user.is_premium
        },
        "quizzes": [
            {
                "title": quiz.title,
                "subject": quiz.subject,
                "difficulty": quiz.difficulty,
                "created_at": quiz.created_at.isoformat(),
                "questions_count": len(quiz.questions)
            }
            for quiz in user_quizzes
        ],
        "quiz_attempts": [
            {
                "quiz_id": attempt.quiz_id,
                "score": attempt.score,
                "time_taken": attempt.time_taken,
                "completed_at": attempt.created_at.isoformat()
            }
            for attempt in user_attempts
        ],
        "progress_records": [
            {
                "subject": record.subject,
                "topic": record.topic,
                "mastery_level": record.mastery_level,
                "study_time": record.study_time,
                "last_studied": record.last_studied.isoformat() if record.last_studied else None
            }
            for record in user_progress
        ],
        "chat_sessions": [
            {
                "title": chat.title,
                "subject": chat.subject,
                "message_count": len(chat.messages),
                "created_at": chat.created_at.isoformat()
            }
            for chat in user_chats
        ]
    }
    
    return export_data