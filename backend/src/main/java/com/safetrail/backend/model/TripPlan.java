package com.safetrail.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long touristId;

    private String source;
    private String destination;

    @Column(length = 2000)
    private String routeDetails; // JSON or text route

    private String transportMode; // BUS / CAR / WALK

    private String status; // PLANNED / ACTIVE / COMPLETED
}