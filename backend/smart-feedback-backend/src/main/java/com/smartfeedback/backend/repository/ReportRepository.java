package com.smartfeedback.backend.repository;

import com.smartfeedback.backend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByFacultyName(String facultyName);
    
    List<Report> findByFacultyNameOrderByCreatedAtDesc(String facultyName);
}
