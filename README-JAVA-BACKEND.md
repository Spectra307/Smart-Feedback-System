# Smart Feedback AI - Java Backend Integration

This project has been updated to use a Java Spring Boot backend for sentiment analysis and report generation, while maintaining the React frontend and Supabase for data persistence.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Java Backend   │    │   Supabase DB   │
│                 │    │                 │    │                 │
│ - Student UI    │◄──►│ - Sentiment API │    │ - User Auth     │
│ - Admin UI      │    │ - Report API    │    │ - Feedback Data │
│ - API Service   │    │ - H2 Database   │    │ - Reports       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Project Structure

```
smart-feedback-ai/
├── src/                          # React Frontend
│   ├── components/               # UI Components
│   ├── services/                 # API Service (NEW)
│   ├── config/                   # Configuration (NEW)
│   └── integrations/supabase/    # Supabase Client
├── backend/                      # Java Backend (NEW)
│   └── smart-feedback-backend/
│       ├── src/main/java/
│       │   └── com/smartfeedback/backend/
│       │       ├── controller/   # REST Controllers
│       │       ├── service/      # Business Logic
│       │       ├── entity/       # JPA Entities
│       │       ├── repository/   # Data Repositories
│       │       └── dto/          # Data Transfer Objects
│       └── pom.xml              # Maven Configuration
└── supabase/                    # Supabase Functions (Legacy)
```

## Setup Instructions

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **Java 17** or higher
- **Maven** (or use the included Maven wrapper)
- **Supabase Account** (for database and authentication)

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here

# Java Backend Configuration
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Java Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend/smart-feedback-backend
   ```

2. **Set environment variable for AI Gateway:**
   ```bash
   # Windows (PowerShell)
   $env:LOVABLE_API_KEY="your_lovable_api_key_here"
   
   # Windows (Command Prompt)
   set LOVABLE_API_KEY=your_lovable_api_key_here
   
   # Linux/Mac
   export LOVABLE_API_KEY=your_lovable_api_key_here
   ```

3. **Build and run the backend:**
   ```bash
   # Using Maven wrapper (recommended)
   ./mvnw spring-boot:run
   
   # Or using Maven (if installed globally)
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### 4. Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## API Endpoints

### Java Backend Endpoints

#### Sentiment Analysis
- **POST** `/api/sentiment/analyze`
  ```json
  {
    "comment": "The professor was excellent and very helpful"
  }
  ```
  Response:
  ```json
  {
    "sentiment": "Positive"
  }
  ```

#### Report Generation
- **POST** `/api/reports/generate`
  ```json
  {
    "facultyName": "Dr. John Smith"
  }
  ```
  Response:
  ```json
  {
    "report": {
      "id": 1,
      "facultyName": "Dr. John Smith",
      "avgTeachingQuality": 4.2,
      "avgCommunicationSkill": 4.0,
      "sentimentSummary": "Based on 10 feedback submissions: 70.0% Positive, 20.0% Negative, 10.0% Neutral...",
      "totalFeedbackCount": 10,
      "positiveCount": 7,
      "negativeCount": 2,
      "neutralCount": 1,
      "createdAt": "2024-01-15T10:30:00"
    }
  }
  ```

#### Health Checks
- **GET** `/api/sentiment/health`
- **GET** `/api/reports/health`

## How It Works

### 1. Feedback Submission Flow

1. **Student submits feedback** through the React frontend
2. **Frontend calls Java backend** for sentiment analysis
3. **Java backend analyzes sentiment** using AI Gateway
4. **Frontend saves feedback** to Supabase with sentiment data
5. **User sees confirmation** with sentiment analysis

### 2. Report Generation Flow

1. **Admin selects faculty** and requests report generation
2. **Frontend calls Java backend** for report generation
3. **Java backend queries Supabase** for faculty feedback data
4. **Java backend calculates statistics** and generates report
5. **Frontend saves report** to Supabase for persistence
6. **Admin views generated report** in the dashboard

## Key Features

### Java Backend Features
- ✅ **Sentiment Analysis**: AI-powered sentiment classification
- ✅ **Report Generation**: Comprehensive faculty analytics
- ✅ **RESTful API**: Clean, well-documented endpoints
- ✅ **Error Handling**: Proper HTTP status codes and error messages
- ✅ **CORS Support**: Configured for frontend integration
- ✅ **H2 Database**: In-memory database for development
- ✅ **Validation**: Input validation using Bean Validation
- ✅ **Logging**: Comprehensive logging for debugging

### Frontend Integration
- ✅ **API Service**: Centralized API communication
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Loading States**: Proper loading indicators
- ✅ **Type Safety**: TypeScript interfaces for API responses
- ✅ **Configuration**: Environment-based configuration

## Development

### Backend Development

The Java backend uses Spring Boot with the following key components:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and external API calls
- **Entities**: JPA entities for database mapping
- **Repositories**: Data access layer
- **DTOs**: Data transfer objects for API communication

### Frontend Development

The React frontend has been updated with:

- **API Service**: New service layer for Java backend communication
- **Configuration**: Centralized configuration management
- **Type Safety**: TypeScript interfaces for all API calls

## Database Schema

### Supabase Tables

```sql
-- Feedback table
CREATE TABLE feedback (
  id BIGSERIAL PRIMARY KEY,
  faculty_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  teaching_quality INTEGER NOT NULL CHECK (teaching_quality >= 1 AND teaching_quality <= 5),
  communication_skill INTEGER NOT NULL CHECK (communication_skill >= 1 AND communication_skill <= 5),
  comment TEXT,
  sentiment TEXT CHECK (sentiment IN ('Positive', 'Negative', 'Neutral')),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  faculty_name TEXT NOT NULL,
  avg_teaching_quality DECIMAL(3,2) NOT NULL,
  avg_communication_skill DECIMAL(3,2) NOT NULL,
  sentiment_summary TEXT,
  total_feedback_count INTEGER NOT NULL,
  positive_count INTEGER NOT NULL,
  negative_count INTEGER NOT NULL,
  neutral_count INTEGER NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Deployment

### Backend Deployment

1. **Build the JAR file:**
   ```bash
   ./mvnw clean package
   ```

2. **Run the JAR:**
   ```bash
   java -jar target/smart-feedback-backend-0.0.1-SNAPSHOT.jar
   ```

3. **Set production environment variables:**
   ```bash
   export LOVABLE_API_KEY=your_production_api_key
   export SPRING_PROFILES_ACTIVE=production
   ```

### Frontend Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Set production environment variables** in your hosting platform

## Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check if Java 17+ is installed
   - Verify LOVABLE_API_KEY is set
   - Check if port 8080 is available

2. **Frontend can't connect to backend:**
   - Verify backend is running on port 8080
   - Check CORS configuration
   - Verify VITE_API_BASE_URL in environment

3. **Sentiment analysis fails:**
   - Check LOVABLE_API_KEY is valid
   - Verify AI Gateway is accessible
   - Check network connectivity

### Logs

- **Backend logs**: Check console output when running `./mvnw spring-boot:run`
- **Frontend logs**: Check browser developer console
- **H2 Database**: Access at `http://localhost:8080/h2-console`

## Migration from Supabase Functions

This project has been migrated from Supabase Edge Functions to a Java Spring Boot backend. The migration provides:

- **Better Performance**: Java backend with connection pooling
- **Enhanced Error Handling**: Proper HTTP status codes and error messages
- **Type Safety**: Strong typing with Java and TypeScript
- **Scalability**: Better resource management and scaling options
- **Development Experience**: Local development with hot reloading
- **Testing**: Comprehensive unit and integration testing capabilities

The frontend continues to use Supabase for:
- User authentication
- Data persistence
- Real-time subscriptions
- Database management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is licensed under the MIT License.
