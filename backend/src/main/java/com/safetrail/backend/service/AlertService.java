package com.safetrail.backend.service;

import com.safetrail.backend.model.Alert;
import com.safetrail.backend.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertRepository repository;

    // ✅ Get all alerts
    public List<Alert> getAllAlerts() {
        return repository.findAll();
    }

    // ✅ Get alerts by tourist
    public List<Alert> getAlertsByTourist(Long touristId) {
        return repository.findAll()
                .stream()
                .filter(a -> a.getTouristId().equals(touristId))
                .toList();
    }
}