package com.safetrail.backend.controller;

import com.safetrail.backend.model.TripPlan;
import com.safetrail.backend.service.TripPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripPlanController {

    @Autowired
    private TripPlanService service;

    // ✅ Create Trip
    @PostMapping
    public TripPlan createTrip(@RequestBody TripPlan trip) {
        return service.createTrip(trip);
    }

    // ✅ Get ALL trips (admin view)
    @GetMapping
    public List<TripPlan> getAllTrips() {
        return service.getAllTrips();
    }

    // ✅ Get Trips by Tourist
    @GetMapping("/{touristId}")
    public List<TripPlan> getTrips(@PathVariable Long touristId) {
        return service.getTrips(touristId);
    }
}
