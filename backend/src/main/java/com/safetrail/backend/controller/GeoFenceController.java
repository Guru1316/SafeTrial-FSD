package com.safetrail.backend.controller;

import com.safetrail.backend.model.GeoFenceZone;
import com.safetrail.backend.repository.GeoFenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geofence")
public class GeoFenceController {

    @Autowired
    private GeoFenceRepository repository;

    @PostMapping
    public GeoFenceZone createZone(@RequestBody GeoFenceZone zone) {
        return repository.save(zone);
    }

    @GetMapping
    public List<GeoFenceZone> getAllZones() {
        return repository.findAll();
    }
}