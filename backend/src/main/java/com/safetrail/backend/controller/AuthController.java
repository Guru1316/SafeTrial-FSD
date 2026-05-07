package com.safetrail.backend.controller;

import com.safetrail.backend.blockchain.HashUtil;
import com.safetrail.backend.model.Tourist;
import com.safetrail.backend.model.User;
import com.safetrail.backend.repository.TouristRepository;
import com.safetrail.backend.repository.UserRepository;
import com.safetrail.backend.security.JwtUtil;
import com.safetrail.backend.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private TouristRepository touristRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private BlockchainService blockchainService;

    /**
     * Tourist self-registration:
     * Creates tourist profile + user account in one step.
     * Returns JWT with touristId already embedded.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String username  = (String) body.get("username");
        String password  = (String) body.get("password");
        String fullName  = (String) body.getOrDefault("fullName", username);
        String gender    = (String) body.getOrDefault("gender", "");
        String nationality = (String) body.getOrDefault("nationality", "");
        String passport  = (String) body.getOrDefault("passportNumber", "");
        String phone     = (String) body.getOrDefault("phoneNumber", "");
        String emergName = (String) body.getOrDefault("emergencyName", "");
        String emergPhone= (String) body.getOrDefault("emergencyPhone", "");
        String emergRel  = (String) body.getOrDefault("emergencyRelation", "");
        String destination = (String) body.getOrDefault("destination", "");
        String itinerary = (String) body.getOrDefault("itinerary", "");

        if (username == null || username.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        if (password == null || password.length() < 6)
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
        if (userRepository.existsByUsername(username))
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        if (fullName.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Full name is required"));
        if (passport.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Passport number is required"));
        if (phone.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number is required"));
        if (destination.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Destination is required"));

        // 1. Create tourist profile with blockchain hash
        String hash = HashUtil.generateHash(fullName + passport + System.currentTimeMillis());
        Tourist tourist = Tourist.builder()
                .digitalIdHash(hash)
                .fullName(fullName)
                .gender(gender)
                .nationality(nationality)
                .passportNumber(passport)
                .phoneNumber(phone)
                .emergencyName(emergName)
                .emergencyPhone(emergPhone)
                .emergencyRelation(emergRel)
                .destination(destination)
                .itinerary(itinerary)
                .safetyStatus("SAFE")
                .safetyScore(100.0)
                .trackingEnabled(true)
                .panicTriggered(false)
                .currentLatitude(0.0)
                .currentLongitude(0.0)
                .createdAt(LocalDateTime.now())
                .build();
        Tourist savedTourist = touristRepository.save(tourist);

        // 2. Log to blockchain
        blockchainService.addBlock("Tourist Self-Registered: ID=" + savedTourist.getId() + " Name=" + fullName);

        // 3. Create user account linked to tourist
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role("TOURIST")
                .fullName(fullName)
                .touristId(savedTourist.getId())
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(user);

        // 4. Return JWT with touristId embedded
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), savedTourist.getId(), user.getFullName());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole(),
                "fullName", user.getFullName(),
                "touristId", savedTourist.getId(),
                "digitalIdHash", savedTourist.getDigitalIdHash(),
                "message", "Registration successful! Your Tourist ID is #" + savedTourist.getId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getTouristId(), user.getFullName());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole(),
                "fullName", user.getFullName(),
                "touristId", user.getTouristId() != null ? user.getTouristId() : ""
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "role", user.getRole(),
                "fullName", user.getFullName(),
                "touristId", user.getTouristId() != null ? user.getTouristId() : ""
        ));
    }
}
