package com.safetrail.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long touristId;
    private String type;
    private String message;

    private Double latitude;
    private Double longitude;

    private LocalDateTime timestamp;
}