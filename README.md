# Smart Feedback AI

A full-stack application for analyzing user feedback, generating sentiment, and producing reports.

- Backend: Spring Boot (Java) under `backend/smart-feedback-backend`
- Frontend/Client: Node.js project at repo root (see `package.json`)

## Project Structure

```
.
├─ backend/
│  └─ smart-feedback-backend/
│     ├─ src/main/java/com/smartfeedback/backend/
│     │  ├─ config/
│     │  ├─ controller/
│     │  ├─ dto/
│     │  ├─ entity/
│     │  ├─ repository/
│     │  └─ service/
│     └─ src/test/java/com/smartfeedback/backend/
├─ package.json
└─ README.md
```

Key Java classes live under `backend/smart-feedback-backend/src/main/java/com/smartfeedback/backend`, including:
- `controller/ReportGenerationController.java`
- `controller/SentimentAnalysisController.java`
- `service/ReportGenerationService.java`
- `service/SentimentAnalysisService.java`
- `entity/Feedback.java`, `entity/Report.java`

## Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ and npm (for the client at repo root)
- Git

## Backend: Run locally
```bash
cd backend/smart-feedback-backend
mvn spring-boot:run
```
By default the API runs at `http://localhost:8080`.

Environment configuration (example):
- API key authentication is enabled via a filter; set your key and header according to `config/ApiKeyAuthFilter.java`.
- You can pass properties with `--spring-boot.run.arguments=--server.port=8081` if you need a different port.

### Example endpoints
- POST `/api/sentiment/analyze` — perform sentiment analysis on feedback (see `SentimentAnalysisController`).
- POST `/api/report/generate` — generate a report from submitted feedback (see `ReportGenerationController`).

Request DTOs are in `dto/` (e.g., `SentimentAnalysisRequest.java`, `ReportGenerationRequest.java`).

## Frontend/Client: Run locally
```bash
npm install
npm run dev
```
(Adjust scripts if your client uses a different dev command.)

## Development
- Format and style: follow the existing code style; avoid unnecessary changes.
- Recommended JDK: Temurin 17 or higher.
- Tests: run with `mvn test` inside `backend/smart-feedback-backend`.

## Build
```bash
cd backend/smart-feedback-backend
mvn clean package
```
The runnable JAR will be in `target/`.

## Contributing
- Open an issue for discussion before large changes.
- Use feature branches and pull requests to `main`.

## License
Specify your license here (e.g., MIT) if applicable.
