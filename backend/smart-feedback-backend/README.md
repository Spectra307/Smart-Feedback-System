# Smart Feedback AI Backend

A Java Spring Boot backend service for the Smart Feedback AI application that provides sentiment analysis and report generation capabilities.

## Features

- **Sentiment Analysis**: Analyzes feedback comments using AI to determine sentiment (Positive, Negative, Neutral)
- **Report Generation**: Generates comprehensive reports for faculty based on feedback data
- **RESTful API**: Clean REST endpoints for frontend integration
- **Database Integration**: JPA/Hibernate with H2 database for development
- **CORS Support**: Configured for frontend integration

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Setup

1. **Environment Variables**: Set the following environment variable:
   ```bash
   export LOVABLE_API_KEY=your_lovable_api_key_here
   ```

2. **Build the project**:
   ```bash
   mvn clean install
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Sentiment Analysis
- **POST** `/api/sentiment/analyze`
  - Request body: `{"comment": "Your feedback comment here"}`
  - Response: `{"sentiment": "Positive|Negative|Neutral"}`

### Report Generation
- **POST** `/api/reports/generate`
  - Request body: `{"facultyName": "Faculty Name"}`
  - Response: Report object with statistics and sentiment summary

### Health Checks
- **GET** `/api/sentiment/health`
- **GET** `/api/reports/health`

## Database

The application uses H2 in-memory database for development. You can access the H2 console at:
`http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## Configuration

Key configuration properties in `application.properties`:

- `server.port`: Server port (default: 8080)
- `ai.gateway.url`: AI Gateway endpoint
- `ai.gateway.model`: AI model to use
- `spring.web.cors.allowed-origins`: Allowed CORS origins

## Development

The project structure follows Spring Boot conventions:

```
src/main/java/com/smartfeedback/backend/
├── SmartFeedbackBackendApplication.java    # Main application class
├── config/                                 # Configuration classes
├── controller/                             # REST controllers
├── dto/                                    # Data Transfer Objects
├── entity/                                 # JPA entities
├── repository/                             # Data repositories
└── service/                                # Business logic services
```

## Testing

Run tests with:
```bash
mvn test
```

## Production Deployment

For production deployment:

1. Replace H2 with a production database (PostgreSQL, MySQL, etc.)
2. Update database configuration in `application.properties`
3. Set proper environment variables
4. Configure proper logging levels
5. Set up monitoring and health checks
