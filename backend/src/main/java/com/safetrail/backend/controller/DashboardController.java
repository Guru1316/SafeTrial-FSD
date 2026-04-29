package com.safetrail.backend.controller;

import com.safetrail.backend.dto.DashboardResponse;
import com.safetrail.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @GetMapping("/summary")
    public DashboardResponse getSummary() {
        return service.getSummary();
    }
}