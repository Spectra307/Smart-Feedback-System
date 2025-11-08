package com.smartfeedback.backend.service;

import com.smartfeedback.backend.dto.ReportGenerationRequest;
import com.smartfeedback.backend.dto.ReportGenerationResponse;
import com.smartfeedback.backend.entity.Feedback;
import com.smartfeedback.backend.entity.Report;
import com.smartfeedback.backend.repository.FeedbackRepository;
import com.smartfeedback.backend.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportGenerationService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportGenerationService.class);
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private ReportRepository reportRepository;
    
    public ReportGenerationResponse generateReport(ReportGenerationRequest request) {
        String facultyName = request.getFacultyName();
        logger.info("Generating report for faculty: {}", facultyName);
        
        // Fetch all feedback for this faculty
        List<Feedback> feedbackList = feedbackRepository.findByFacultyName(facultyName);
        
        if (feedbackList.isEmpty()) {
            throw new RuntimeException("No feedback found for this faculty");
        }
        
        // Calculate averages
        double avgTeachingQuality = feedbackRepository.findAverageTeachingQualityByFacultyName(facultyName);
        double avgCommunicationSkill = feedbackRepository.findAverageCommunicationSkillByFacultyName(facultyName);
        
        // Count sentiments
        long positiveCount = feedbackRepository.countByFacultyNameAndSentiment(facultyName, Feedback.Sentiment.POSITIVE);
        long negativeCount = feedbackRepository.countByFacultyNameAndSentiment(facultyName, Feedback.Sentiment.NEGATIVE);
        long neutralCount = feedbackRepository.countByFacultyNameAndSentiment(facultyName, Feedback.Sentiment.NEUTRAL);
        
        // Generate sentiment summary
        int totalFeedback = feedbackList.size();
        double positivePercent = (positiveCount * 100.0) / totalFeedback;
        double negativePercent = (negativeCount * 100.0) / totalFeedback;
        double neutralPercent = (neutralCount * 100.0) / totalFeedback;
        
        String sentimentSummary = String.format(
            "Based on %d feedback submissions: %.1f%% Positive, %.1f%% Negative, %.1f%% Neutral. " +
            "Overall teaching quality: %.2f/5, Communication skill: %.2f/5.",
            totalFeedback, positivePercent, negativePercent, neutralPercent,
            avgTeachingQuality, avgCommunicationSkill
        );
        
        // Create and save report
        Report report = new Report(
            facultyName,
            avgTeachingQuality,
            avgCommunicationSkill,
            sentimentSummary,
            totalFeedback,
            (int) positiveCount,
            (int) negativeCount,
            (int) neutralCount
        );
        
        Report savedReport = reportRepository.save(report);
        logger.info("Report generated successfully: {}", savedReport.getId());
        
        return new ReportGenerationResponse(savedReport);
    }
    
    public List<Report> getAllReports() {
        logger.info("Retrieving all reports");
        return reportRepository.findAll();
    }
    
    public List<Report> getReportsByFaculty(String facultyName) {
        logger.info("Retrieving reports for faculty: {}", facultyName);
        return reportRepository.findByFacultyNameOrderByCreatedAtDesc(facultyName);
    }
}
