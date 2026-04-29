package com.safetrail.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeoFenceZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double centerLat;
    private Double centerLng;

    private Double radius; // in KM

    private String zoneType; // SAFE / RISK / RESTRICTED
}