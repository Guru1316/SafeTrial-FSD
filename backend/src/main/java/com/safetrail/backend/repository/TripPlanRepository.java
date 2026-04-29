package com.safetrail.backend.repository;

import com.safetrail.backend.model.TripPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripPlanRepository extends JpaRepository<TripPlan, Long> {

    List<TripPlan> findByTouristId(Long touristId);
}