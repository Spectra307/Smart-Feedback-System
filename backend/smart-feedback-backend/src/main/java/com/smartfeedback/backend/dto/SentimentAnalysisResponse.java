package com.smartfeedback.backend.dto;

public class SentimentAnalysisResponse {
    
    private String sentiment;
    
    public SentimentAnalysisResponse() {}
    
    public SentimentAnalysisResponse(String sentiment) {
        this.sentiment = sentiment;
    }
    
    public String getSentiment() {
        return sentiment;
    }
    
    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }
}
