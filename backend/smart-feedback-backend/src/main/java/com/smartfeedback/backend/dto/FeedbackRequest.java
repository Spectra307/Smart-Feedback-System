package com.smartfeedback.backend.dto;

import jakarta.validation.constraints.*;

public class FeedbackRequest {
    
    @NotBlank(message = "Faculty name is required")
    private String facultyName;
    
    @NotBlank(message = "Student name is required")
    private String studentName;
    
    @Min(value = 1, message = "Teaching quality must be at least 1")
    @Max(value = 5, message = "Teaching quality must be at most 5")
    @NotNull(message = "Teaching quality is required")
    private Integer teachingQuality;
    
    @Min(value = 1, message = "Communication skill must be at least 1")
    @Max(value = 5, message = "Communication skill must be at most 5")
    @NotNull(message = "Communication skill is required")
    private Integer communicationSkill;
    
    private String comment;
    
    public FeedbackRequest() {}
    
    public FeedbackRequest(String facultyName, String studentName, Integer teachingQuality, 
                          Integer communicationSkill, String comment) {
        this.facultyName = facultyName;
        this.studentName = studentName;
        this.teachingQuality = teachingQuality;
        this.communicationSkill = communicationSkill;
        this.comment = comment;
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
}

