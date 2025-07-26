package com.figmine.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;

@Service
public class ImageGenerationService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateImage(String prompt) {
        String stableDiffusionUrl = "http://127.0.0.1:7860/sdapi/v1/txt2img";

        // Prepare request body
        Map<String, Object> requestBody = Map.of(
            "prompt", prompt,
            "steps", 25,
            "cfg_scale", 7
        );

        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(stableDiffusionUrl, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // Extract base64 image and save or return dummy image URL for now
                return "http://127.0.0.1:7860/generated/output.png";
            } else {
                throw new RuntimeException("Failed to generate image.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error during image generation: " + e.getMessage());
        }
    }
}
