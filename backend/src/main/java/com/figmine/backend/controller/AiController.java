package com.figmine.backend.controller;

import com.figmine.backend.config.ApiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final RestTemplate restTemplate = new RestTemplate();
    
    @Autowired
    private ApiConfig apiConfig;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateImage(@RequestBody Map<String, String> requestBody) {
        String prompt = requestBody.get("prompt");

        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required."));
        }

        // Construct payload for Stable Diffusion API
        Map<String, Object> sdPayload = new HashMap<>();
        sdPayload.put("prompt", prompt);
        sdPayload.put("steps", 25);
        sdPayload.put("cfg_scale", 7);
        sdPayload.put("sampler_index", "Euler");
        sdPayload.put("width", 512);
        sdPayload.put("height", 512);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(sdPayload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiConfig.getStableDiffusionApiUrl(), httpEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Object imagesObject = response.getBody().get("images");

                if (imagesObject instanceof List<?> images && !images.isEmpty()) {
                    Object firstImage = images.get(0);
                    if (firstImage instanceof String base64Image) {
                        return ResponseEntity.ok(Map.of("image", base64Image));
                    }
                }
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No valid image found in AI response."));

        } catch (Exception e) {
            // Log the error and return a detailed response
            e.printStackTrace();
            String errorMessage = "Image generation failed: " + e.getMessage();
            
            // Check if it's a connection error to Stable Diffusion
            if (e.getMessage().contains("Connection refused") || e.getMessage().contains("ConnectException")) {
                errorMessage = "Cannot connect to Stable Diffusion. Please ensure it's running on http://127.0.0.1:7860";
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", errorMessage));
        }
    }
}
