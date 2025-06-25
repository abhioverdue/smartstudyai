from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.core.security import verify_password, get_password_hash
from app.schemas.user import UserCreate


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Authenticate user with username/email and password"""
        result = await self.db.execute(
            select(User).where(
                (User.username == username) | (User.email == username)
            )
        )
        user = result.scalar_one_or_none()
        
        if not user or not verify_password(password, user.hashed_password):
            return None
        
        if not user.is_active:
            return None
            
        return user
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create new user"""
        # Check if user already exists
        result = await self.db.execute(
            select(User).where(
                (User.email == user_data.email) | (User.username == user_data.username)
            )
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise ValueError("User with this email or username already exists")
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            hashed_password=hashed_password,
            is_active=user_data.is_active,
            is_premium=user_data.is_premium,
            bio=user_data.bio
        )
        
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        
        return db_user
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def update_user_password(self, user: User, new_password: str) -> User:
        """Update user password"""
        user.hashed_password = get_password_hash(new_password)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def deactivate_user(self, user: User) -> User:
        """Deactivate user account"""
        user.is_active = False
        await self.db.commit()
        await self.db.refresh(user)
        return user
