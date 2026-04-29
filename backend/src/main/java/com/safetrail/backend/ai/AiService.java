package com.safetrail.backend.ai;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {

    private final String AI_URL = "http://localhost:5000/analyze";

    public Map<String, Object> analyze(String lastUpdated) {

        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> request = new HashMap<>();
        request.put("lastUpdated", lastUpdated);

        return restTemplate.postForObject(AI_URL, request, Map.class);
    }
}