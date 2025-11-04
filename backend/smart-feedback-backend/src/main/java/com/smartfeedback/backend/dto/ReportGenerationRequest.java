package com.smartfeedback.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ReportGenerationRequest {
    
    @NotBlank(message = "Faculty name is required")
    private String facultyName;
    
    public ReportGenerationRequest() {}
    
    public ReportGenerationRequest(String facultyName) {
        this.facultyName = facultyName;
    }
    
    public String getFacultyName() {
        return facultyName;
    }
    
    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }
}
