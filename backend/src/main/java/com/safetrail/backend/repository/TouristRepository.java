package com.safetrail.backend.repository;

import com.safetrail.backend.model.Tourist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TouristRepository extends JpaRepository<Tourist, Long> {

    Optional<Tourist> findByDigitalIdHash(String digitalIdHash);
}