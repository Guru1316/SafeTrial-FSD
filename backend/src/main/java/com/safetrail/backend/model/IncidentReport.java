package com.safetrail.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long touristId;

    private String title;

    @Column(length = 2000)
    private String description;

    private String status; // OPEN / INVESTIGATING / CLOSED

    private LocalDateTime createdAt;
}