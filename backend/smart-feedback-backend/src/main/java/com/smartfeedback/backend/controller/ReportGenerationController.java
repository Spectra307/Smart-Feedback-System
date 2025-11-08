package com.smartfeedback.backend.controller;

import com.smartfeedback.backend.dto.ReportGenerationRequest;
import com.smartfeedback.backend.dto.ReportGenerationResponse;
import com.smartfeedback.backend.service.ReportGenerationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReportGenerationController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportGenerationController.class);
    
    @Autowired
    private ReportGenerationService reportGenerationService;
    
    @PostMapping("/generate")
    public ResponseEntity<?> generateReport(@Valid @RequestBody ReportGenerationRequest request) {
        try {
            logger.info("Received report generation request for faculty: {}", request.getFacultyName());
            
            ReportGenerationResponse response = reportGenerationService.generateReport(request);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            logger.error("Error in report generation: ", e);
            
            if (e.getMessage().contains("No feedback found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error generating report: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error in report generation: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Unexpected error occurred"));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Report Generation Service is running");
    }
    
    @GetMapping
    public ResponseEntity<?> getAllReports() {
        try {
            return ResponseEntity.ok(reportGenerationService.getAllReports());
        } catch (Exception e) {
            logger.error("Error retrieving reports: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error retrieving reports: " + e.getMessage()));
        }
    }
    
    @GetMapping("/faculty/{facultyName}")
    public ResponseEntity<?> getReportsByFaculty(@PathVariable String facultyName) {
        try {
            return ResponseEntity.ok(reportGenerationService.getReportsByFaculty(facultyName));
        } catch (Exception e) {
            logger.error("Error retrieving reports for faculty: {}", facultyName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error retrieving reports: " + e.getMessage()));
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
