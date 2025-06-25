# backend/tests/conftest.py
import pytest
import asyncio
from typing import AsyncGenerator, Generator
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
from httpx import AsyncClient

from app.main import app
from app.core.database import get_db, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.quiz import Quiz
from app.models.progress import Progress

# Test database URL (SQLite for testing)
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def setup_database():
    """Create test database tables."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db_session(setup_database) -> AsyncGenerator[AsyncSession, None]:
    """Create a database session for testing."""
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()


@pytest.fixture
def override_get_db(db_session: AsyncSession):
    """Override the database dependency."""
    async def _override_get_db():
        yield db_session
    return _override_get_db


@pytest.fixture
def client(override_get_db):
    """Create a test client."""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
async def async_client(override_get_db):
    """Create an async test client."""
    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    """Create a test user."""
    user = User(
        email="test@example.com",
        username="testuser",
        first_name="Test",
        last_name="User",
        hashed_password=get_password_hash("testpassword123"),
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
async def test_user_token(client, test_user) -> str:
    """Get authentication token for test user."""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "testuser", "password": "testpassword123"}
    )
    return response.json()["access_token"]


@pytest.fixture
async def authenticated_headers(test_user_token: str) -> dict:
    """Get headers with authentication token."""
    return {"Authorization": f"Bearer {test_user_token}"}


@pytest.fixture
async def test_quiz(db_session: AsyncSession, test_user: User) -> Quiz:
    """Create a test quiz."""
    quiz = Quiz(
        title="Test Quiz",
        description="A test quiz for testing",
        subject="Mathematics",
        difficulty="medium",
        questions=[
            {
                "question": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correct_answer": 1,
                "explanation": "2 + 2 equals 4"
            },
            {
                "question": "What is 3 * 3?",
                "options": ["6", "9", "12", "15"],
                "correct_answer": 1,
                "explanation": "3 * 3 equals 9"
            }
        ],
        user_id=test_user.id,
        is_ai_generated=False
    )
    db_session.add(quiz)
    await db_session.commit()
    await db_session.refresh(quiz)
    return quiz


@pytest.fixture
async def test_progress(db_session: AsyncSession, test_user: User) -> Progress:
    """Create a test progress record."""
    progress = Progress(
        user_id=test_user.id,
        subject="Mathematics",
        topic="Algebra",
        mastery_level=0.75,
        study_time=120,
        quiz_scores=[85.0, 90.0, 78.0],
        strengths=["Linear equations", "Factoring"],
        weaknesses=["Quadratic equations"]
    )
    db_session.add(progress)
    await db_session.commit()
    await db_session.refresh(progress)
    return progress