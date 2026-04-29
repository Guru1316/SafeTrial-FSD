package com.safetrail.backend.controller;

import com.safetrail.backend.model.IncidentReport;
import com.safetrail.backend.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentService service;

    // ✅ Create incident
    @PostMapping
    public IncidentReport create(@RequestBody IncidentReport incident) {
        return service.createIncident(incident);
    }

    // ✅ Get all incidents
    @GetMapping
    public List<IncidentReport> getAll() {
        return service.getAll();
    }

    // ✅ Get by tourist
    @GetMapping("/{touristId}")
    public List<IncidentReport> getByTourist(@PathVariable Long touristId) {
        return service.getByTourist(touristId);
    }

    // ✅ Update status
    @PutMapping("/{id}")
    public IncidentReport updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return service.updateStatus(id, status);
    }
}