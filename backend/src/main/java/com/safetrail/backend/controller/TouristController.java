package com.safetrail.backend.controller;

import com.safetrail.backend.dto.TouristRequest;
import com.safetrail.backend.model.Tourist;
import com.safetrail.backend.service.TouristService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tourists")
public class TouristController {

    @Autowired
    private TouristService service;

    // ✅ REGISTER
    @PostMapping("/register")
    public Tourist register(@Valid @RequestBody TouristRequest request) {
        return service.register(request);
    }

    // ✅ GET ALL
    @GetMapping
    public List<Tourist> getAll() {
        return service.getAll();
    }

    // 🚨 PANIC
    @PostMapping("/panic/{id}")
    public String panic(
            @PathVariable Long id,
            @RequestParam Double lat,
            @RequestParam Double lng) {

        return service.triggerPanic(id, lat, lng);
    }

    // 📍 LOCATION UPDATE
    @PostMapping("/location/{id}")
    public String updateLocation(
            @PathVariable Long id,
            @RequestParam Double lat,
            @RequestParam Double lng) {

        return service.updateLocation(id, lat, lng);
    }
}