package com.smartfeedback.backend.controller;

import com.smartfeedback.backend.dto.FeedbackRequest;
import com.smartfeedback.backend.dto.FeedbackResponse;
import com.smartfeedback.backend.dto.SentimentAnalysisRequest;
import com.smartfeedback.backend.dto.SentimentAnalysisResponse;
import com.smartfeedback.backend.entity.Feedback;
import com.smartfeedback.backend.repository.FeedbackRepository;
import com.smartfeedback.backend.service.SentimentAnalysisService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FeedbackController {
    
    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;
    
    @PostMapping
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        try {
            logger.info("Received feedback submission for faculty: {}", request.getFacultyName());
            
            // Analyze sentiment if comment is provided
            Feedback.Sentiment sentiment = Feedback.Sentiment.NEUTRAL;
            if (request.getComment() != null && !request.getComment().trim().isEmpty()) {
                SentimentAnalysisRequest sentimentRequest = new SentimentAnalysisRequest(request.getComment());
                SentimentAnalysisResponse sentimentResponse = sentimentAnalysisService.analyzeSentiment(sentimentRequest);
                
                // Convert string sentiment to enum
                try {
                    sentiment = Feedback.Sentiment.valueOf(sentimentResponse.getSentiment().toUpperCase());
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid sentiment value: {}, defaulting to NEUTRAL", sentimentResponse.getSentiment());
                    sentiment = Feedback.Sentiment.NEUTRAL;
                }
            }
            
            // Create and save feedback
            Feedback feedback = new Feedback(
                request.getFacultyName(),
                request.getStudentName(),
                request.getTeachingQuality(),
                request.getCommunicationSkill(),
                request.getComment()
            );
            feedback.setSentiment(sentiment);
            
            Feedback savedFeedback = feedbackRepository.save(feedback);
            logger.info("Feedback saved successfully with ID: {}", savedFeedback.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(new FeedbackResponse(savedFeedback));
            
        } catch (Exception e) {
            logger.error("Error submitting feedback: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error submitting feedback: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        try {
            List<Feedback> feedbackList = feedbackRepository.findAll();
            List<FeedbackResponse> responses = feedbackList.stream()
                    .map(FeedbackResponse::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error retrieving feedback: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/student/{studentName}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackByStudent(@PathVariable String studentName) {
        try {
            List<Feedback> feedbackList = feedbackRepository.findAll().stream()
                    .filter(f -> f.getStudentName().equalsIgnoreCase(studentName))
                    .collect(Collectors.toList());
            List<FeedbackResponse> responses = feedbackList.stream()
                    .map(FeedbackResponse::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error retrieving feedback for student: {}", studentName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/faculty/{facultyName}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackByFaculty(@PathVariable String facultyName) {
        try {
            List<Feedback> feedbackList = feedbackRepository.findByFacultyName(facultyName);
            List<FeedbackResponse> responses = feedbackList.stream()
                    .map(FeedbackResponse::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error retrieving feedback for faculty: {}", facultyName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Inner class for error responses
    public static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
    }
}

