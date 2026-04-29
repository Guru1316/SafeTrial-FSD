package com.safetrail.backend.controller;

import com.safetrail.backend.model.Alert;
import com.safetrail.backend.model.IncidentReport;
import com.safetrail.backend.model.Tourist;
import com.safetrail.backend.repository.AlertRepository;
import com.safetrail.backend.repository.IncidentReportRepository;
import com.safetrail.backend.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private TouristRepository touristRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private IncidentReportRepository incidentRepository;

    // 👮 All tourists
    @GetMapping("/tourists")
    public List<Tourist> getAllTourists() {
        return touristRepository.findAll();
    }

    // 🚨 All alerts
    @GetMapping("/alerts")
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    // 🚨 Only panic alerts
    @GetMapping("/panic")
    public List<Alert> getPanicAlerts() {
        return alertRepository.findAll()
                .stream()
                .filter(a -> "PANIC".equals(a.getType()))
                .toList();
    }

    // 📄 All incidents (E-FIR)
    @GetMapping("/incidents")
    public List<IncidentReport> getAllIncidents() {
        return incidentRepository.findAll();
    }
}