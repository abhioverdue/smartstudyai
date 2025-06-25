# SmartStudy AI+ Setup Guide

This guide will help you set up the SmartStudy AI+ application locally for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (v13 or higher)
- **Redis** (optional, for caching)
- **Git**

## 1. Clone the Repository

```bash
git clone <repository-url>
cd smartstudy-ai
```

## 2. Database Setup

### PostgreSQL Setup

1. Install PostgreSQL and start the service
2. Create a new database and user:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE smartstudy_db;

-- Create user
CREATE USER smartstudy_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE smartstudy_db TO smartstudy_user;
```

### Redis Setup (Optional)

Install and start Redis:

```bash
# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# macOS
brew install redis
brew services start redis

# Windows
# Download from https://redis.io/download
```

## 3. Backend Setup

### Environment Variables

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy the environment template:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```bash
# Database
DATABASE_URL=postgresql://smartstudy_user:your_password@localhost:5432/smartstudy_db

# Security
SECRET_KEY=your-super-secret-key-here-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Redis (optional)
REDIS_URL=redis://localhost:6379/0

# CORS
ALLOWED_HOSTS=["http://localhost:3000"]
```

### Python Environment Setup

1. Create and activate virtual environment:
```bash
python -m venv venv

# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Database Migration

Run database migrations:
```bash
alembic upgrade head
```

### Start Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

## 4. Frontend Setup

### Environment Variables

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Copy the environment template:
```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` with your configuration:
```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Install Dependencies

```bash
npm install
```

### Start Frontend Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 5. OpenAI API Setup

1. Sign up for an OpenAI account at https://platform.openai.com/
2. Create an API key
3. Add the key to your backend `.env` file
4. Ensure you have sufficient credits/usage limits

## 6. Verification

### Backend Health Check

Visit `http://localhost:8000/health` - should return:
```json
{
  "status": "healthy",
  "service": "smartstudy-api"
}
```

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

### Frontend

Visit `http://localhost:3000` to see the application.

## 7. Optional: OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to:
   - `http://localhost:3000/api/auth/callback/github` (development)

## 8. Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## 9. Troubleshooting

### Common Issues

**Database Connection Error:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**OpenAI API Error:**
- Verify API key is correct
- Check OpenAI account has sufficient credits
- Ensure API key has proper permissions

**CORS Error:**
- Check `ALLOWED_HOSTS` in backend `.env`
- Verify frontend URL is included

**Module Not Found:**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Logs

Check application logs:
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend logs are in terminal where you ran npm run dev
```

## 10. Next Steps

After successful setup:

1. Create a test user account
2. Generate your first AI quiz
3. Explore the tutor chat feature
4. Check the progress dashboard

## Development Tips

- Use `--reload` flag for hot reloading during development
- Check API documentation at `/docs` endpoint
- Use browser dev tools for frontend debugging
- Monitor database queries in development mode

## Security Notes

- Change default secret keys before production
- Use environment-specific configurations
- Keep API keys secure and never commit them
- Use HTTPS in production
- Regularly update dependencies

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md).