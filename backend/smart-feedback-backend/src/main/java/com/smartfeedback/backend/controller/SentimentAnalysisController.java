package com.smartfeedback.backend.controller;

import com.smartfeedback.backend.dto.SentimentAnalysisRequest;
import com.smartfeedback.backend.dto.SentimentAnalysisResponse;
import com.smartfeedback.backend.service.SentimentAnalysisService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sentiment")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SentimentAnalysisController {
    
    private static final Logger logger = LoggerFactory.getLogger(SentimentAnalysisController.class);
    
    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;
    
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeSentiment(@Valid @RequestBody SentimentAnalysisRequest request) {
        try {
            logger.info("Received sentiment analysis request for comment: {}", request.getComment());
            
            SentimentAnalysisResponse response = sentimentAnalysisService.analyzeSentiment(request);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            logger.error("Error in sentiment analysis: ", e);
            
            if (e.getMessage().contains("Rate limit exceeded")) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(new ErrorResponse(e.getMessage()));
            }
            
            if (e.getMessage().contains("Payment required")) {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                        .body(new ErrorResponse(e.getMessage()));
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error analyzing sentiment: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error in sentiment analysis: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Unexpected error occurred"));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Sentiment Analysis Service is running");
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
