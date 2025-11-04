package com.smartfeedback.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Faculty name is required")
    @Column(name = "faculty_name", nullable = false)
    private String facultyName;
    
    @DecimalMin(value = "1.0", message = "Average teaching quality must be at least 1.0")
    @DecimalMax(value = "5.0", message = "Average teaching quality must be at most 5.0")
    @Column(name = "avg_teaching_quality", nullable = false)
    private Double avgTeachingQuality;
    
    @DecimalMin(value = "1.0", message = "Average communication skill must be at least 1.0")
    @DecimalMax(value = "5.0", message = "Average communication skill must be at most 5.0")
    @Column(name = "avg_communication_skill", nullable = false)
    private Double avgCommunicationSkill;
    
    @Column(name = "sentiment_summary", columnDefinition = "TEXT")
    private String sentimentSummary;
    
    @Min(value = 0, message = "Total feedback count must be non-negative")
    @Column(name = "total_feedback_count", nullable = false)
    private Integer totalFeedbackCount;
    
    @Min(value = 0, message = "Positive count must be non-negative")
    @Column(name = "positive_count", nullable = false)
    private Integer positiveCount;
    
    @Min(value = 0, message = "Negative count must be non-negative")
    @Column(name = "negative_count", nullable = false)
    private Integer negativeCount;
    
    @Min(value = 0, message = "Neutral count must be non-negative")
    @Column(name = "neutral_count", nullable = false)
    private Integer neutralCount;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Report() {}
    
    public Report(String facultyName, Double avgTeachingQuality, Double avgCommunicationSkill,
                 String sentimentSummary, Integer totalFeedbackCount, Integer positiveCount,
                 Integer negativeCount, Integer neutralCount) {
        this.facultyName = facultyName;
        this.avgTeachingQuality = avgTeachingQuality;
        this.avgCommunicationSkill = avgCommunicationSkill;
        this.sentimentSummary = sentimentSummary;
        this.totalFeedbackCount = totalFeedbackCount;
        this.positiveCount = positiveCount;
        this.negativeCount = negativeCount;
        this.neutralCount = neutralCount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFacultyName() {
        return facultyName;
    }
    
    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }
    
    public Double getAvgTeachingQuality() {
        return avgTeachingQuality;
    }
    
    public void setAvgTeachingQuality(Double avgTeachingQuality) {
        this.avgTeachingQuality = avgTeachingQuality;
    }
    
    public Double getAvgCommunicationSkill() {
        return avgCommunicationSkill;
    }
    
    public void setAvgCommunicationSkill(Double avgCommunicationSkill) {
        this.avgCommunicationSkill = avgCommunicationSkill;
    }
    
    public String getSentimentSummary() {
        return sentimentSummary;
    }
    
    public void setSentimentSummary(String sentimentSummary) {
        this.sentimentSummary = sentimentSummary;
    }
    
    public Integer getTotalFeedbackCount() {
        return totalFeedbackCount;
    }
    
    public void setTotalFeedbackCount(Integer totalFeedbackCount) {
        this.totalFeedbackCount = totalFeedbackCount;
    }
    
    public Integer getPositiveCount() {
        return positiveCount;
    }
    
    public void setPositiveCount(Integer positiveCount) {
        this.positiveCount = positiveCount;
    }
    
    public Integer getNegativeCount() {
        return negativeCount;
    }
    
    public void setNegativeCount(Integer negativeCount) {
        this.negativeCount = negativeCount;
    }
    
    public Integer getNeutralCount() {
        return neutralCount;
    }
    
    public void setNeutralCount(Integer neutralCount) {
        this.neutralCount = neutralCount;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
