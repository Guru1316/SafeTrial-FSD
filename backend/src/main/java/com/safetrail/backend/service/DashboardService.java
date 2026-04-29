package com.safetrail.backend.service;

import com.safetrail.backend.dto.DashboardResponse;
import com.safetrail.backend.model.Tourist;
import com.safetrail.backend.repository.AlertRepository;
import com.safetrail.backend.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private TouristRepository touristRepository;

    @Autowired
    private AlertRepository alertRepository;

    public DashboardResponse getSummary() {

        List<Tourist> tourists = touristRepository.findAll();

        long totalTourists = tourists.size();

        long riskTourists = tourists.stream()
                .filter(t -> "RISK".equals(t.getSafetyStatus()))
                .count();

        long panicCount = tourists.stream()
                .filter(t -> Boolean.TRUE.equals(t.getPanicTriggered()))
                .count();

        long totalAlerts = alertRepository.count();

        return new DashboardResponse(
                totalTourists,
                riskTourists,
                panicCount,
                totalAlerts
        );
    }
}