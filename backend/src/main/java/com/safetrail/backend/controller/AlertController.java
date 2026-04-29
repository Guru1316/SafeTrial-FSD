package com.safetrail.backend.controller;

import com.safetrail.backend.model.Alert;
import com.safetrail.backend.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertService service;

    // ✅ Get all alerts (for dashboard)
    @GetMapping
    public List<Alert> getAllAlerts() {
        return service.getAllAlerts();
    }

    // ✅ Get alerts for specific tourist
    @GetMapping("/{touristId}")
    public List<Alert> getAlertsByTourist(@PathVariable Long touristId) {
        return service.getAlertsByTourist(touristId);
    }
}