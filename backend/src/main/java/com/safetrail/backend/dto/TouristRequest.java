package com.safetrail.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TouristRequest {

    @NotBlank
    private String fullName;

    private String gender;
    private String nationality;

    @NotBlank
    private String passportNumber;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String emergencyName;

    @NotBlank
    private String emergencyPhone;

    @NotBlank
    private String destination;

    @NotBlank
    private String itinerary;
}