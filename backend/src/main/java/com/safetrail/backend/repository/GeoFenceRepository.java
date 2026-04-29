package com.safetrail.backend.repository;

import com.safetrail.backend.model.GeoFenceZone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeoFenceRepository extends JpaRepository<GeoFenceZone, Long> {
}