package com.safetrail.backend.service;

import com.safetrail.backend.ai.AiService;
import com.safetrail.backend.blockchain.HashUtil;
import com.safetrail.backend.dto.TouristRequest;
import com.safetrail.backend.model.Alert;
import com.safetrail.backend.model.GeoFenceZone;
import com.safetrail.backend.model.Tourist;
import com.safetrail.backend.repository.AlertRepository;
import com.safetrail.backend.repository.GeoFenceRepository;
import com.safetrail.backend.repository.TouristRepository;
import com.safetrail.backend.util.GeoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TouristService {

    @Autowired
    private TouristRepository repository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private GeoFenceRepository geoFenceRepository;

    @Autowired
    private AiService aiService;

    @Autowired
    private BlockchainService blockchainService; // ✅ FINAL ADDITION

    // =========================
    // ✅ REGISTER TOURIST
    // =========================
    public Tourist register(TouristRequest req) {

        String rawData = req.getFullName() + req.getPassportNumber() + System.currentTimeMillis();
        String hash = HashUtil.generateHash(rawData);

        Tourist tourist = Tourist.builder()
                .digitalIdHash(hash)
                .fullName(req.getFullName())
                .gender(req.getGender())
                .nationality(req.getNationality())
                .passportNumber(req.getPassportNumber())
                .phoneNumber(req.getPhoneNumber())
                .emergencyName(req.getEmergencyName())
                .emergencyPhone(req.getEmergencyPhone())
                .destination(req.getDestination())
                .itinerary(req.getItinerary())

                // Defaults
                .safetyStatus("SAFE")
                .safetyScore(100.0)
                .trackingEnabled(true)
                .panicTriggered(false)
                .currentLatitude(0.0)
                .currentLongitude(0.0)
                .createdAt(LocalDateTime.now())

                .build();

        Tourist saved = repository.save(tourist);

        // 🔗 Blockchain Log
        blockchainService.addBlock("Tourist Registered: " + saved.getId());

        return saved;
    }

    // =========================
    // ✅ GET ALL TOURISTS
    // =========================
    public List<Tourist> getAll() {
        return repository.findAll();
    }

    // =========================
    // 🚨 PANIC TRIGGER
    // =========================
    public String triggerPanic(Long touristId, Double lat, Double lng) {

        Tourist tourist = repository.findById(touristId)
                .orElseThrow(() -> new RuntimeException("Tourist not found"));

        tourist.setPanicTriggered(true);
        tourist.setSafetyStatus("RISK");
        tourist.setCurrentLatitude(lat);
        tourist.setCurrentLongitude(lng);
        tourist.setLastUpdated(LocalDateTime.now());

        repository.save(tourist);

        Alert alert = Alert.builder()
                .touristId(touristId)
                .type("PANIC")
                .message("Emergency panic triggered")
                .latitude(lat)
                .longitude(lng)
                .timestamp(LocalDateTime.now())
                .build();

        alertRepository.save(alert);

        // 🔗 Blockchain Log
        blockchainService.addBlock("PANIC triggered for Tourist ID: " + touristId);

        return "🚨 Panic alert triggered";
    }

    // =========================
    // 📍 LOCATION UPDATE + GEOFENCE + AI
    // =========================
    public String updateLocation(Long touristId, Double lat, Double lng) {

        Tourist tourist = repository.findById(touristId)
                .orElseThrow(() -> new RuntimeException("Tourist not found"));

        tourist.setCurrentLatitude(lat);
        tourist.setCurrentLongitude(lng);
        tourist.setLastUpdated(LocalDateTime.now());

        boolean riskDetected = false;

        // =========================
        // 🔍 GEOFENCE CHECK
        // =========================
        List<GeoFenceZone> zones = geoFenceRepository.findAll();

        for (GeoFenceZone zone : zones) {

            double distance = GeoUtil.calculateDistance(
                    lat, lng,
                    zone.getCenterLat(), zone.getCenterLng()
            );

            if (distance <= zone.getRadius()) {

                if ("RESTRICTED".equals(zone.getZoneType()) || "RISK".equals(zone.getZoneType())) {

                    riskDetected = true;

                    Alert alert = Alert.builder()
                            .touristId(touristId)
                            .type("GEOFENCE")
                            .message("Entered " + zone.getZoneType() + " zone: " + zone.getName())
                            .latitude(lat)
                            .longitude(lng)
                            .timestamp(LocalDateTime.now())
                            .build();

                    alertRepository.save(alert);
                }
            }
        }

        // =========================
        // 🧠 AI CHECK
        // =========================
        try {
            Map<String, Object> aiResult = aiService.analyze(
                    tourist.getLastUpdated().toString()
            );

            if (aiResult != null) {

                String status = (String) aiResult.get("status");
                String alertMsg = (String) aiResult.get("alert");

                if ("RISK".equals(status) && alertMsg != null) {

                    riskDetected = true;

                    Alert alert = Alert.builder()
                            .touristId(touristId)
                            .type("AI_ALERT")
                            .message(alertMsg)
                            .latitude(lat)
                            .longitude(lng)
                            .timestamp(LocalDateTime.now())
                            .build();

                    alertRepository.save(alert);
                }
            }

        } catch (Exception e) {
            System.out.println("AI service unavailable (safe fallback)");
        }

        // =========================
        // FINAL STATUS UPDATE
        // =========================
        if (riskDetected) {
            tourist.setSafetyStatus("RISK");
        } else {
            tourist.setSafetyStatus("SAFE");
        }

        repository.save(tourist);

        // 🔗 Blockchain Log
        blockchainService.addBlock("Location updated for Tourist ID: " + touristId);

        return "📍 Location updated + geofence + AI checked";
    }
}