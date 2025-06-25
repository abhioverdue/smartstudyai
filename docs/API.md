# SmartStudy AI+ API Documentation

This document provides comprehensive documentation for the SmartStudy AI+ REST API.

## Base URL

- **Development:** `http://localhost:8000`
- **Production:** `https://your-api-domain.com`

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /api/v1/auth/login

Authenticate user and get access token.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `400` - Inactive user

#### POST /api/v1/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "is_premium": false,
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - User already exists

### User Management

#### GET /api/v1/users/me

Get current user profile (requires authentication).

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "is_premium": false,
  "bio": "Student studying computer science",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### PUT /api/v1/users/me

Update current user profile.

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "bio": "Updated bio"
}
```

### Quiz Management

#### GET /api/v1/quiz/

Get user's quizzes with optional filtering.

**Query Parameters:**
- `skip` (int): Number of records to skip (default: 0)
- `limit` (int): Number of records to return (default: 100)
- `subject` (string): Filter by subject

**Response:**
```json
[
  {
    "id": 1,
    "title": "Python Basics Quiz",
    "description": "Test your Python fundamentals",
    "subject": "Programming",
    "difficulty": "medium",
    "questions": [...],
    "time_limit": 30,
    "user_id": 1,
    "is_ai_generated": true,
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

#### POST /api/v1/quiz/

Create a new quiz manually.

**Request Body:**
```json
{
  "title": "Math Quiz",
  "description": "Basic algebra questions",
  "subject": "Mathematics",
  "difficulty": "easy",
  "time_limit": 20,
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correct_answer": 1,
      "explanation": "2 + 2 equals 4"
    }
  ]
}
```

#### POST /api/v1/quiz/generate

Generate a quiz using AI.

**Request Body:**
```json
{
  "subject": "Python Programming",
  "topic": "Functions and Loops",
  "difficulty": "medium",
  "num_questions": 10,
  "question_types": ["multiple_choice"]
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Python Functions and Loops Quiz",
  "description": "AI-generated quiz on Python functions and loops",
  "subject": "Python Programming",
  "difficulty": "medium",
  "questions": [...],
  "user_id": 1,
  "is_ai_generated": true,
  "created_at": "2024-01-01T12:00:00Z"
}
```

#### GET /api/v1/quiz/{quiz_id}

Get a specific quiz by ID.

**Response:**
```json
{
  "id": 1,
  "title": "Python Basics Quiz",
  "description": "Test your Python fundamentals",
  "subject": "Programming",
  "difficulty": "medium",
  "questions": [
    {
      "question": "What is the output of print('Hello World')?",
      "options": ["Hello World", "hello world", "HELLO WORLD", "Error"],
      "correct_answer": 0,
      "explanation": "Python print() function outputs exactly what's in quotes"
    }
  ],
  "time_limit": 30,
  "user_id": 1,
  "is_ai_generated": true,
  "created_at": "2024-01-01T12:00:00Z"
}
```

#### POST /api/v1/quiz/{quiz_id}/submit

Submit quiz answers and get results.

**Request Body:**
```json
{
  "quiz_id": 1,
  "answers": [0, 1, 2],
  "time_taken": 450
}
```

**Response:**
```json
{
  "id": 1,
  "quiz_id": 1,
  "answers": [0, 1, 2],
  "score": 85.5,
  "time_taken": 450,
  "completed": true,
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Progress Tracking

#### GET /api/v1/progress/dashboard

Get comprehensive dashboard statistics.

**Response:**
```json
{
  "total_quizzes": 15,
  "total_study_time": 480,
  "average_score": 78.5,
  "subjects_studied": 3,
  "recent_activity": [
    {
      "type": "quiz_completed",
      "title": "Python Functions Quiz",
      "subject": "Programming",
      "score": 85.0,
      "date": "2024-01-01T12:00:00Z"
    }
  ],
  "progress_by_subject": [
    {
      "subject": "Programming",
      "mastery_level": 75.0,
      "study_time": 240
    }
  ],
  "weekly_progress": [
    {
      "week": "Week 1",
      "quizzes_completed": 5,
      "average_score": 80.0
    }
  ]
}
```

#### GET /api/v1/progress/

Get user's progress records.

**Query Parameters:**
- `subject` (string): Filter by subject

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "subject": "Programming",
    "topic": "Python Basics",
    "mastery_level": 75.0,
    "study_time": 120,
    "quiz_scores": [85.0, 90.0, 70.0],
    "strengths": ["Functions", "Variables"],
    "weaknesses": ["Loops", "Classes"],
    "last_studied": "2024-01-01",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
]
```

#### POST /api/v1/progress/

Create a new progress record.

**Request Body:**
```json
{
  "subject": "Mathematics",
  "topic": "Algebra",
  "mastery_level": 60.0,
  "study_time": 90,
  "last_studied": "2024-01-01"
}
```

#### PUT /api/v1/progress/{progress_id}

Update a progress record.

**Request Body:**
```json
{
  "mastery_level": 80.0,
  "study_time": 150,
  "quiz_scores": [75.0, 85.0, 90.0],
  "strengths": ["Linear Equations", "Factoring"],
  "weaknesses": ["Quadratic Equations"]
}
```

### AI Tutor

#### POST /api/v1/tutor/chat

Chat with the AI tutor.

**Request Body:**
```json
{
  "message": "Can you explain Python functions?",
  "subject": "Programming",
  "session_id": 1
}
```

**Response:**
```json
{
  "response": "Python functions are reusable blocks of code that perform specific tasks...",
  "session_id": 1,
  "suggestions": [
    "Can you show me an example of a Python function?",
    "What are function parameters?",
    "How do I return values from functions?"
  ]
}
```

#### GET /api/v1/tutor/sessions

Get user's chat sessions.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Chat about Programming",
    "subject": "Programming",
    "last_message": "Python functions are reusable blocks...",
    "updated_at": "2024-01-01T12:00:00Z"
  }
]
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users:** 100 requests per hour
- **Unauthenticated users:** 20 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination using `skip` and `limit` parameters:

```
GET /api/v1/quiz/?skip=10&limit=20
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

```
GET /api/v1/quiz/?subject=Programming&difficulty=medium
```

## WebSocket Endpoints

For real-time features:

### /ws/tutor/{session_id}

WebSocket connection for real-time chat with AI tutor.

**Message Format:**
```json
{
  "type": "message",
  "content": "Your question here",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## SDK and Client Libraries

Official SDKs available for:
- JavaScript/TypeScript
- Python
- React Hooks

## Testing

Use the interactive API documentation at `/docs` to test endpoints directly.
