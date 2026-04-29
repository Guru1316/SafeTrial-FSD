package com.safetrail.backend.service;

import com.safetrail.backend.model.TripPlan;
import com.safetrail.backend.repository.TripPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripPlanService {

    @Autowired
    private TripPlanRepository repository;

    // ✅ Create Trip
    public TripPlan createTrip(TripPlan trip) {
        trip.setStatus("PLANNED");
        return repository.save(trip);
    }

    // ✅ Get trips by tourist
    public List<TripPlan> getTrips(Long touristId) {
        return repository.findByTouristId(touristId);
    }
}