package com.figmine.backend.controller;

import com.figmine.backend.config.ApiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    private final RestTemplate restTemplate = new RestTemplate();
    
    @Autowired
    private ApiConfig apiConfig;

    @GetMapping("/stable-diffusion")
    public ResponseEntity<Map<String, Object>> checkStableDiffusion() {
        try {
            String healthUrl = apiConfig.getStableDiffusionUrl() + "/sdapi/v1/progress";
            ResponseEntity<Map> response = restTemplate.getForEntity(healthUrl, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(Map.of(
                    "status", "running",
                    "message", "Stable Diffusion is running and accessible"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "status", "error",
                    "message", "Stable Diffusion responded with status: " + response.getStatusCode()
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "status", "error",
                "message", "Cannot connect to Stable Diffusion: " + e.getMessage(),
                "url", apiConfig.getStableDiffusionUrl()
            ));
        }
    }
} 