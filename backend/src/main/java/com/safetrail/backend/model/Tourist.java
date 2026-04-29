package com.safetrail.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tourists")
public class Tourist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String digitalIdHash;

    // Basic Info
    @Column(nullable = false)
    private String fullName;

    private String gender;
    private String nationality;
    private LocalDate dateOfBirth;

    // KYC
    @Column(nullable = false)
    private String passportNumber;

    private String aadhaarNumber;

    // Contact
    @Column(nullable = false)
    private String phoneNumber;

    private String email;

    // Emergency
    @Column(nullable = false)
    private String emergencyName;

    @Column(nullable = false)
    private String emergencyPhone;

    private String emergencyRelation;

    // Travel
    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String itinerary;

    private String sourceLocation;

    private LocalDate startDate;
    private LocalDate endDate;

    // Tracking
    private Double currentLatitude;
    private Double currentLongitude;
    private LocalDateTime lastUpdated;

    // Safety
    private String safetyStatus;
    private Double safetyScore;

    // Flags
    private Boolean trackingEnabled;
    private Boolean panicTriggered;

    private LocalDateTime createdAt;
}