# backend/tests/api/test_auth.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class TestAuth:
    """Test authentication endpoints."""
    
    def test_register_user(self, client: TestClient):
        """Test user registration."""
        user_data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "first_name": "New",
            "last_name": "User",
            "password": "newpassword123"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["username"] == user_data["username"]
        assert data["first_name"] == user_data["first_name"]
        assert data["last_name"] == user_data["last_name"]
        assert "hashed_password" not in data
    
    def test_register_duplicate_user(self, client: TestClient, test_user: User):
        """Test registration with existing email/username."""
        user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "first_name": "Test",
            "last_name": "User",
            "password": "testpassword123"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    
    def test_login_success(self, client: TestClient, test_user: User):
        """Test successful login."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "testuser", "password": "testpassword123"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_credentials(self, client: TestClient, test_user: User):
        """Test login with invalid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "testuser", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]
    
    def test_login_with_email(self, client: TestClient, test_user: User):
        """Test login using email instead of username."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "test@example.com", "password": "testpassword123"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data


# backend/tests/api/test_quiz.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.quiz import Quiz


class TestQuiz:
    """Test quiz endpoints."""
    
    def test_get_quizzes(self, client: TestClient, authenticated_headers: dict, test_quiz: Quiz):
        """Test getting user's quizzes."""
        response = client.get("/api/v1/quiz/", headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) >= 1
        assert data[0]["title"] == "Test Quiz"
    
    def test_create_quiz(self, client: TestClient, authenticated_headers: dict):
        """Test creating a new quiz."""
        quiz_data = {
            "title": "New Quiz",
            "description": "A new quiz",
            "subject": "Science",
            "difficulty": "easy",
            "questions": [
                {
                    "question": "What is H2O?",
                    "options": ["Water", "Hydrogen", "Oxygen", "Carbon"],
                    "correct_answer": 0,
                    "explanation": "H2O is the chemical formula for water"
                }
            ]
        }
        
        response = client.post("/api/v1/quiz/", json=quiz_data, headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["title"] == quiz_data["title"]
        assert data["subject"] == quiz_data["subject"]
        assert len(data["questions"]) == 1
    
    def test_get_quiz_by_id(self, client: TestClient, authenticated_headers: dict, test_quiz: Quiz):
        """Test getting a specific quiz."""
        response = client.get(f"/api/v1/quiz/{test_quiz.id}", headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == test_quiz.id
        assert data["title"] == test_quiz.title
    
    def test_get_nonexistent_quiz(self, client: TestClient, authenticated_headers: dict):
        """Test getting a quiz that doesn't exist."""
        response = client.get("/api/v1/quiz/99999", headers=authenticated_headers)
        assert response.status_code == 404
    
    def test_submit_quiz(self, client: TestClient, authenticated_headers: dict, test_quiz: Quiz):
        """Test submitting quiz answers."""
        submission_data = {
            "quiz_id": test_quiz.id,
            "answers": [1, 1],  # Both correct answers
            "time_taken": 120
        }
        
        response = client.post(
            f"/api/v1/quiz/{test_quiz.id}/submit",
            json=submission_data,
            headers=authenticated_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["score"] == 100.0  # Both answers correct
        assert data["quiz_id"] == test_quiz.id
    
    def test_submit_quiz_partial_correct(self, client: TestClient, authenticated_headers: dict, test_quiz: Quiz):
        """Test submitting quiz with partial correct answers."""
        submission_data = {
            "quiz_id": test_quiz.id,
            "answers": [1, 0],  # One correct, one incorrect
            "time_taken": 90
        }
        
        response = client.post(
            f"/api/v1/quiz/{test_quiz.id}/submit",
            json=submission_data,
            headers=authenticated_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["score"] == 50.0  # 50% correct


# backend/tests/api/test_progress.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.progress import Progress


class TestProgress:
    """Test progress endpoints."""
    
    def test_get_dashboard_stats(self, client: TestClient, authenticated_headers: dict):
        """Test getting dashboard statistics."""
        response = client.get("/api/v1/progress/dashboard", headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "total_quizzes" in data
        assert "total_study_time" in data
        assert "average_score" in data
        assert "subjects_studied" in data
        assert "recent_activity" in data
        assert "progress_by_subject" in data
        assert "weekly_progress" in data
    
    def test_get_progress_records(self, client: TestClient, authenticated_headers: dict, test_progress: Progress):
        """Test getting progress records."""
        response = client.get("/api/v1/progress/", headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) >= 1
        assert data[0]["subject"] == "Mathematics"
        assert data[0]["mastery_level"] == 0.75
    
    def test_create_progress_record(self, client: TestClient, authenticated_headers: dict):
        """Test creating a new progress record."""
        progress_data = {
            "subject": "Physics",
            "topic": "Mechanics",
            "mastery_level": 0.6,
            "study_time": 90
        }
        
        response = client.post("/api/v1/progress/", json=progress_data, headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["subject"] == progress_data["subject"]
        assert data["topic"] == progress_data["topic"]
        assert data["mastery_level"] == progress_data["mastery_level"]
    
    def test_update_progress_record(self, client: TestClient, authenticated_headers: dict, test_progress: Progress):
        """Test updating a progress record."""
        update_data = {
            "mastery_level": 0.85,
            "study_time": 150
        }
        
        response = client.put(
            f"/api/v1/progress/{test_progress.id}",
            json=update_data,
            headers=authenticated_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["mastery_level"] == update_data["mastery_level"]
        assert data["study_time"] == update_data["study_time"]
    
    def test_filter_progress_by_subject(self, client: TestClient, authenticated_headers: dict, test_progress: Progress):
        """Test filtering progress records by subject."""
        response = client.get(
            "/api/v1/progress/?subject=Mathematics",
            headers=authenticated_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert all(record["subject"] == "Mathematics" for record in data)


# backend/tests/api/test_tutor.py
import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient


class TestTutor:
    """Test AI tutor endpoints."""
    
    @patch('app.services.ai_service.AIService.chat_with_tutor')
    def test_chat_with_tutor_new_session(self, mock_chat, client: TestClient, authenticated_headers: dict):
        """Test starting a new chat session with AI tutor."""
        mock_chat.return_value = {
            "response": "Hello! I'm here to help you learn. What would you like to study today?",
            "suggestions": ["Tell me about algebra", "Help me with calculus", "Explain geometry concepts"]
        }
        
        chat_data = {
            "message": "Hi, I need help with math",
            "subject": "Mathematics"
        }
        
        response = client.post("/api/v1/tutor/chat", json=chat_data, headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "response" in data
        assert "session_id" in data
        assert "suggestions" in data
        assert len(data["suggestions"]) > 0
    
    @patch('app.services.ai_service.AIService.chat_with_tutor')
    def test_chat_with_tutor_existing_session(self, mock_chat, client: TestClient, authenticated_headers: dict):
        """Test continuing an existing chat session."""
        mock_chat.return_value = {
            "response": "Great question! Let me explain quadratic equations step by step...",
            "suggestions": ["Show me an example", "What about the discriminant?", "How do I factor this?"]
        }
        
        # First, create a session
        initial_chat = {
            "message": "Hi, I need help with math",
            "subject": "Mathematics"
        }
        initial_response = client.post("/api/v1/tutor/chat", json=initial_chat, headers=authenticated_headers)
        session_id = initial_response.json()["session_id"]
        
        # Continue the conversation
        follow_up_chat = {
            "message": "Can you explain quadratic equations?",
            "subject": "Mathematics",
            "session_id": session_id
        }
        
        response = client.post("/api/v1/tutor/chat", json=follow_up_chat, headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["session_id"] == session_id
        assert "quadratic equations" in data["response"].lower()
    
    def test_get_chat_sessions(self, client: TestClient, authenticated_headers: dict):
        """Test getting user's chat sessions."""
        response = client.get("/api/v1/tutor/sessions", headers=authenticated_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_chat_without_auth(self, client: TestClient):
        """Test that chat endpoint requires authentication."""
        chat_data = {
            "message": "Hi, I need help with math",
            "subject": "Mathematics"
        }
        
        response = client.post("/api/v1/tutor/chat", json=chat_data)
        assert response.status_code == 403