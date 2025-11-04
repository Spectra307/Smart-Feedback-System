package com.smartfeedback.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class SentimentAnalysisRequest {
    
    @NotBlank(message = "Comment is required")
    private String comment;
    
    public SentimentAnalysisRequest() {}
    
    public SentimentAnalysisRequest(String comment) {
        this.comment = comment;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
}
