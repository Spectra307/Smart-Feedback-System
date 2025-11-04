package com.smartfeedback.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartfeedback.backend.dto.SentimentAnalysisRequest;
import com.smartfeedback.backend.dto.SentimentAnalysisResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class SentimentAnalysisService {
    
    private static final Logger logger = LoggerFactory.getLogger(SentimentAnalysisService.class);
    
    @Value("${ai.gateway.url}")
    private String aiGatewayUrl;
    
    @Value("${ai.gateway.model}")
    private String aiModel;
    
    @Value("${ai.gateway.temperature}")
    private double temperature;
    
    @Value("${ai.gateway.max-tokens}")
    private int maxTokens;
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public SentimentAnalysisService() {
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }
    
    public SentimentAnalysisResponse analyzeSentiment(SentimentAnalysisRequest request) {
        String comment = request.getComment();
        logger.info("Analyzing sentiment for comment: {}", comment);
        
        if (comment == null || comment.trim().isEmpty()) {
            return new SentimentAnalysisResponse("Neutral");
        }
        
        String apiKey = System.getenv("LOVABLE_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("demo_key_for_testing")) {
            logger.warn("LOVABLE_API_KEY is not configured or is demo key, returning mock sentiment");
            // Return a mock sentiment for testing purposes
            String mockSentiment = determineMockSentiment(comment);
            return new SentimentAnalysisResponse(mockSentiment);
        }
        
        try {
            Map<String, Object> requestBody = createRequestBody(comment);
            
            String response = webClient.post()
                    .uri(aiGatewayUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), clientResponse -> {
                        if (clientResponse.statusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                            return Mono.error(new RuntimeException("Rate limit exceeded. Please try again later."));
                        }
                        if (clientResponse.statusCode() == HttpStatus.PAYMENT_REQUIRED) {
                            return Mono.error(new RuntimeException("Payment required. Please add credits to your Lovable AI workspace."));
                        }
                        return Mono.error(new RuntimeException("AI Gateway error: " + clientResponse.statusCode()));
                    })
                    .bodyToMono(String.class)
                    .block();
            
            String sentiment = extractSentimentFromResponse(response);
            logger.info("Sentiment analysis result: {}", sentiment);
            
            return new SentimentAnalysisResponse(sentiment);
            
        } catch (WebClientResponseException e) {
            logger.error("AI Gateway error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI Gateway error: " + e.getStatusCode());
        } catch (Exception e) {
            logger.error("Error in sentiment analysis: ", e);
            throw new RuntimeException("Error analyzing sentiment: " + e.getMessage());
        }
    }
    
    private Map<String, Object> createRequestBody(String comment) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", aiModel);
        requestBody.put("temperature", temperature);
        requestBody.put("max_tokens", maxTokens);
        
        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are a sentiment analysis expert. Analyze the given feedback comment and classify it as exactly one of: \"Positive\", \"Negative\", or \"Neutral\". Respond with ONLY the sentiment classification word, nothing else.");
        
        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", "Analyze this feedback comment and respond with only one word - Positive, Negative, or Neutral:\n\n\"" + comment + "\"");
        
        requestBody.put("messages", new Object[]{systemMessage, userMessage});
        
        return requestBody;
    }
    
    private String extractSentimentFromResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            String sentiment = jsonNode.path("choices").path(0).path("message").path("content").asText().trim();
            
            // Ensure we only return valid sentiments
            String[] validSentiments = {"Positive", "Negative", "Neutral"};
            for (String validSentiment : validSentiments) {
                if (validSentiment.equals(sentiment)) {
                    return validSentiment;
                }
            }
            
            return "Neutral";
        } catch (Exception e) {
            logger.error("Error parsing AI response: ", e);
            return "Neutral";
        }
    }
    
    private String determineMockSentiment(String comment) {
        String lowerComment = comment.toLowerCase();
        
        // Simple keyword-based sentiment analysis for testing
        if (lowerComment.contains("excellent") || lowerComment.contains("great") || 
            lowerComment.contains("amazing") || lowerComment.contains("wonderful") ||
            lowerComment.contains("good") || lowerComment.contains("helpful") ||
            lowerComment.contains("love") || lowerComment.contains("best")) {
            return "Positive";
        } else if (lowerComment.contains("terrible") || lowerComment.contains("awful") ||
                   lowerComment.contains("bad") || lowerComment.contains("hate") ||
                   lowerComment.contains("worst") || lowerComment.contains("horrible") ||
                   lowerComment.contains("disappointed")) {
            return "Negative";
        } else {
            return "Neutral";
        }
    }
}
