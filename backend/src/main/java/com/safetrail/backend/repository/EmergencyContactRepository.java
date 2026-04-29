package com.safetrail.backend.repository;

import com.safetrail.backend.model.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {

    List<EmergencyContact> findByTouristId(Long touristId);
}