package com.safetrail.backend.repository;

import com.safetrail.backend.model.IncidentReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentReportRepository extends JpaRepository<IncidentReport, Long> {

    List<IncidentReport> findByTouristId(Long touristId);
}