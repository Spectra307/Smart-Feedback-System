package com.smartfeedback.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Faculty name is required")
    @Column(name = "faculty_name", nullable = false)
    private String facultyName;
    
    @NotBlank(message = "Student name is required")
    @Column(name = "student_name", nullable = false)
    private String studentName;
    
    @Min(value = 1, message = "Teaching quality must be at least 1")
    @Max(value = 5, message = "Teaching quality must be at most 5")
    @Column(name = "teaching_quality", nullable = false)
    private Integer teachingQuality;
    
    @Min(value = 1, message = "Communication skill must be at least 1")
    @Max(value = 5, message = "Communication skill must be at most 5")
    @Column(name = "communication_skill", nullable = false)
    private Integer communicationSkill;
    
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "sentiment")
    private Sentiment sentiment;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Feedback() {}
    
    public Feedback(String facultyName, String studentName, Integer teachingQuality, 
                   Integer communicationSkill, String comment) {
        this.facultyName = facultyName;
        this.studentName = studentName;
        this.teachingQuality = teachingQuality;
        this.communicationSkill = communicationSkill;
        this.comment = comment;
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
    
    public Sentiment getSentiment() {
        return sentiment;
    }
    
    public void setSentiment(Sentiment sentiment) {
        this.sentiment = sentiment;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public enum Sentiment {
        POSITIVE, NEGATIVE, NEUTRAL
    }
}
