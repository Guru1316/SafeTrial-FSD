package com.safetrail.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private long totalTourists;
    private long riskTourists;
    private long panicCount;
    private long totalAlerts;
}