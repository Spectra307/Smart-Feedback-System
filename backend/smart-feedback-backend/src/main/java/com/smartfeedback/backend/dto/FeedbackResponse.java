package com.smartfeedback.backend.dto;

import com.smartfeedback.backend.entity.Feedback;

import java.time.LocalDateTime;

public class FeedbackResponse {
    
    private Long id;
    private String facultyName;
    private String studentName;
    private Integer teachingQuality;
    private Integer communicationSkill;
    private String comment;
    private String sentiment;
    private LocalDateTime createdAt;
    
    public FeedbackResponse() {}
    
    public FeedbackResponse(Feedback feedback) {
        this.id = feedback.getId();
        this.facultyName = feedback.getFacultyName();
        this.studentName = feedback.getStudentName();
        this.teachingQuality = feedback.getTeachingQuality();
        this.communicationSkill = feedback.getCommunicationSkill();
        this.comment = feedback.getComment();
        // Convert enum to title case (POSITIVE -> Positive)
        if (feedback.getSentiment() != null) {
            String sentimentName = feedback.getSentiment().name();
            this.sentiment = sentimentName.substring(0, 1) + sentimentName.substring(1).toLowerCase();
        } else {
            this.sentiment = null;
        }
        this.createdAt = feedback.getCreatedAt();
    }
    
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
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public Integer getTeachingQuality() {
        return teachingQuality;
    }
    
    public void setTeachingQuality(Integer teachingQuality) {
        this.teachingQuality = teachingQuality;
    }
    
    public Integer getCommunicationSkill() {
        return communicationSkill;
    }
    
    public void setCommunicationSkill(Integer communicationSkill) {
        this.communicationSkill = communicationSkill;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public String getSentiment() {
        return sentiment;
    }
    
    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

