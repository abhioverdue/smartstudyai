# SmartStudy AI+ 🧠✨

A personalized learning assistant platform powered by artificial intelligence, featuring adaptive quizzing, real-time progress tracking, and an intelligent tutoring system.

## 🌟 Features

### 🎯 Core Functionality
- **AI-Powered Quiz Generation**: Create personalized quizzes using GPT-4 based on subject, topic, and difficulty
- **Intelligent Tutoring**: Chat with an AI tutor for personalized learning assistance
- **Progress Tracking**: Real-time analytics and progress monitoring across subjects
- **Adaptive Learning**: System adapts to your learning pace and identifies strengths/weaknesses
- **Multi-Subject Support**: Mathematics, Science, History, and more

### 🚀 Technical Features
- **Modern Tech Stack**: Next.js frontend with FastAPI backend
- **Real-time Updates**: WebSocket support for live progress updates
- **Secure Authentication**: JWT-based auth with OAuth2 flows
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Cloud Ready**: Docker containerization and deployment scripts

## 🏗️ Architecture

```
SmartStudy AI+
├── Frontend (Next.js)     → User Interface & Experience
├── Backend (FastAPI)      → API & Business Logic
├── Database (PostgreSQL)  → Data Persistence
├── AI Service (OpenAI)    → Quiz Generation & Tutoring
└── Cache (Redis)          → Performance Optimization
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **Python** 3.9 or higher
- **PostgreSQL** 13.0 or higher
- **Redis** (optional, for caching)
- **Docker** & **Docker Compose** (for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smartstudy-ai.git
cd smartstudy-ai
```

### 2. Environment Setup

#### Backend Environment
Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/smartstudy
SECRET_KEY=your-super-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key-here
ENVIRONMENT=development
ALLOWED_HOSTS=["http://localhost:3000"]
```

#### Frontend Environment
Create `frontend/.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
pip install python-jose[cryptography]
pip install pydantic-settings 
pip install passlib[bcrypt]
pip install "pydantic[email]"
pip install python-multipart


# Database migration
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f deployment/docker-compose.prod.yml up -d
```

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/v1/auth/login     # User login
POST /api/v1/auth/register  # User registration
```

### Quiz Management
```http
GET    /api/v1/quiz/                 # List user quizzes
POST   /api/v1/quiz/                 # Create custom quiz
POST   /api/v1/quiz/generate         # AI-generate quiz
GET    /api/v1/quiz/{id}             # Get specific quiz
POST   /api/v1/quiz/{id}/submit      # Submit quiz answers
```

### Progress Tracking
```http
GET /api/v1/progress/dashboard  # Dashboard statistics
GET /api/v1/progress/           # Progress records
PUT /api/v1/progress/{id}       # Update progress
```

### AI Tutor
```http
POST /api/v1/tutor/chat      # Chat with AI tutor
GET  /api/v1/tutor/sessions  # Get chat sessions
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:e2e
```

## 📱 Project Structure

```
smartstudy-ai/
├── frontend/                 # Next.js Frontend Application
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── quiz/           # Quiz-related components
│   │   └── tutor/          # AI tutor components
│   ├── pages/              # Next.js pages and API routes
│   ├── lib/                # Utility libraries
│   └── styles/             # CSS and styling files
│
├── backend/                  # FastAPI Backend Application
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality (config, security, DB)
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Utility functions
│   ├── tests/              # Test files
│   └── alembic/            # Database migrations
│
├── mobile/                   # React Native App (Planned)
├── deployment/               # Deployment configurations
└── docs/                     # Documentation files
```

## 🔧 Configuration

### Database Configuration
The application uses PostgreSQL with SQLAlchemy ORM. Database models are defined in `backend/app/models/` and migrations are managed with Alembic.

### AI Integration
- **OpenAI GPT-4**: Used for quiz generation and tutoring
- **Custom Algorithms**: Adaptive difficulty and progress tracking
- **Fallback Systems**: Graceful degradation when AI services are unavailable

### Caching Strategy
Redis is used for:
- Session management
- API response caching
- Real-time data updates

## 🚀 Deployment Options

### 1. Cloud Platforms
- **Vercel** (Frontend) + **Render** (Backend)
- **Netlify** (Frontend) + **Railway** (Backend)
- **AWS** / **Google Cloud** / **Azure**

### 2. Self-Hosted
- Docker Compose setup included
- Nginx reverse proxy configuration
- SSL certificate automation with Let's Encrypt

### 3. Development
- Local development with hot reloading
- SQLite fallback for quick setup
- Mock AI services for testing

## 🛠️ Development Workflow

### 1. Feature Development
```bash
git checkout -b feature/amazing-feature
# Make your changes
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature
```

### 2. Code Quality
- **Backend**: Black, isort, flake8
- **Frontend**: ESLint, Prettier
- **Pre-commit hooks**: Automated code formatting

### 3. Testing Strategy
- **Unit Tests**: Core business logic
- **Integration Tests**: API endpoints
- **E2E Tests**: Critical user flows

## 📊 Monitoring & Analytics

### Application Metrics
- User engagement tracking
- Quiz completion rates
- AI service usage statistics
- Performance monitoring

### Health Checks
- `/health` endpoint for backend
- Database connection monitoring
- External service availability

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt
- **CORS Protection**: Configurable origins
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Pydantic schemas

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes with tests
4. **Submit** a pull request

### Code Style
- Follow existing patterns
- Add tests for new features
- Update documentation
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check the `/docs` folder
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: support@smartstudy-ai.com

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running
2. **OpenAI API**: Verify API key and credits
3. **CORS Errors**: Check allowed origins in backend config
4. **Migration Issues**: Run `alembic upgrade head`

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core quiz system
- ✅ AI tutor integration
- ✅ Progress tracking
- ✅ User authentication

### Phase 2 (Next)
- 📱 Mobile app (React Native)
- 🔊 Voice interaction
- 👥 Collaborative learning
- 📈 Advanced analytics

### Phase 3 (Future)
- 🌐 Multi-language support
- 🎓 Certification system
- 🏢 Institution dashboard
- 🤖 Advanced AI features

## 📈 Performance

### Benchmarks
- **API Response Time**: < 200ms average
- **Quiz Generation**: < 5 seconds
- **Database Queries**: Optimized with indexes
- **Frontend Load Time**: < 2 seconds

### Optimization
- Database query optimization
- CDN for static assets
- Redis caching layer
- Code splitting and lazy loading

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- FastAPI community
- Next.js team
- All contributors and testers

---

**Built with ❤️ by the SmartStudy AI+ Team**

*Empowering learners with intelligent, personalized education technology.*# SmartStudy-AI-
# SmartStudy-AI-
# smartstudyai
# smartstudyai
# smartstudyai
