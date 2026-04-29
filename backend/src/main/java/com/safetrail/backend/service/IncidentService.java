package com.safetrail.backend.service;

import com.safetrail.backend.model.IncidentReport;
import com.safetrail.backend.repository.IncidentReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidentService {

    @Autowired
    private IncidentReportRepository repository;

    // ✅ Create Incident
    public IncidentReport createIncident(IncidentReport incident) {

        incident.setStatus("OPEN");
        incident.setCreatedAt(LocalDateTime.now());

        return repository.save(incident);
    }

    // ✅ Get all incidents
    public List<IncidentReport> getAll() {
        return repository.findAll();
    }

    // ✅ Get by tourist
    public List<IncidentReport> getByTourist(Long touristId) {
        return repository.findByTouristId(touristId);
    }

    // ✅ Update status
    public IncidentReport updateStatus(Long id, String status) {

        IncidentReport incident = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.setStatus(status);

        return repository.save(incident);
    }
}