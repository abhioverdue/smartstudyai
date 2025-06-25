from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.progress import ChatSession
from app.services.ai_service import AIService
from pydantic import BaseModel

router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    subject: str = None
    session_id: int = None


class ChatResponse(BaseModel):
    response: str
    session_id: int
    suggestions: List[str] = []


@router.post("/chat", response_model=ChatResponse)
async def chat_with_tutor(
    chat_data: ChatMessage,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ai_service = AIService()
    
    # Get or create chat session
    if chat_data.session_id:
        result = await db.execute(
            select(ChatSession).where(
                and_(
                    ChatSession.id == chat_data.session_id,
                    ChatSession.user_id == current_user.id
                )
            )
        )
        session = result.scalar_one_or_none()
        
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        # Create new session
        session = ChatSession(
            user_id=current_user.id,
            title=f"Chat about {chat_data.subject or 'General'}",
            subject=chat_data.subject,
            messages=[]
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
    
    # Add user message to session
    session.messages.append({
        "role": "user",
        "content": chat_data.message,
        "timestamp": str(datetime.now())
    })
    
    try:
        # Get AI response
        ai_response = await ai_service.chat_with_tutor(
            message=chat_data.message,
            chat_history=session.messages,
            subject=chat_data.subject
        )
        
        # Add AI response to session
        session.messages.append({
            "role": "assistant",
            "content": ai_response["response"],
            "timestamp": str(datetime.now())
        })
        
        await db.commit()
        
        return ChatResponse(
            response=ai_response["response"],
            session_id=session.id,
            suggestions=ai_response.get("suggestions", [])
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get AI response: {str(e)}"
        )


@router.get("/sessions", response_model=List[dict])
async def get_chat_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ChatSession).where(
            and_(
                ChatSession.user_id == current_user.id,
                ChatSession.is_active == True
            )
        ).order_by(ChatSession.updated_at.desc())
    )
    sessions = result.scalars().all()
    
    return [
        {
            "id": session.id,
            "title": session.title,
            "subject": session.subject,
            "last_message": session.messages[-1]["content"] if session.messages else "",
            "updated_at": session.updated_at
        }
        for session in sessions
    ]
