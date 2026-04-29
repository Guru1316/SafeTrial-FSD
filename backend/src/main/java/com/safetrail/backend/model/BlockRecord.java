package com.safetrail.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String previousHash;

    @Column(length = 2000)
    private String data;

    private String hash;

    private LocalDateTime timestamp;
}