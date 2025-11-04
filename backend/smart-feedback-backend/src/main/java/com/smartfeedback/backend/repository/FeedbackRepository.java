package com.smartfeedback.backend.repository;

import com.smartfeedback.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findByFacultyName(String facultyName);
    
    @Query("SELECT AVG(f.teachingQuality) FROM Feedback f WHERE f.facultyName = :facultyName")
    Double findAverageTeachingQualityByFacultyName(@Param("facultyName") String facultyName);
    
    @Query("SELECT AVG(f.communicationSkill) FROM Feedback f WHERE f.facultyName = :facultyName")
    Double findAverageCommunicationSkillByFacultyName(@Param("facultyName") String facultyName);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.facultyName = :facultyName AND f.sentiment = :sentiment")
    Long countByFacultyNameAndSentiment(@Param("facultyName") String facultyName, 
                                       @Param("sentiment") Feedback.Sentiment sentiment);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.facultyName = :facultyName")
    Long countByFacultyName(@Param("facultyName") String facultyName);
}
