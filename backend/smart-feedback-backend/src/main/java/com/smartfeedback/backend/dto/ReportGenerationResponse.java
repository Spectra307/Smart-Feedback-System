package com.smartfeedback.backend.dto;

import com.smartfeedback.backend.entity.Report;

public class ReportGenerationResponse {
    
    private Report report;
    
    public ReportGenerationResponse() {}
    
    public ReportGenerationResponse(Report report) {
        this.report = report;
    }
    
    public Report getReport() {
        return report;
    }
    
    public void setReport(Report report) {
        this.report = report;
    }
}
