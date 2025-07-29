package com.figmine.backend.service;

import com.figmine.backend.config.ApiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

@Service
public class ImageGenerationService {

    private final RestTemplate restTemplate = new RestTemplate();
    
    @Autowired
    private ApiConfig apiConfig;

    public String generateImage(String prompt) {
        String stableDiffusionUrl = apiConfig.getStableDiffusionApiUrl();

        // Prepare request body with complete Stable Diffusion parameters
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("prompt", prompt);
        requestBody.put("steps", 25);
        requestBody.put("cfg_scale", 7);
        requestBody.put("sampler_index", "Euler");
        requestBody.put("width", 512);
        requestBody.put("height", 512);

        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(stableDiffusionUrl, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object imagesObject = response.getBody().get("images");
                
                if (imagesObject instanceof List<?> images && !images.isEmpty()) {
                    Object firstImage = images.get(0);
                    if (firstImage instanceof String base64Image) {
                        return base64Image; // Return the actual base64 image
                    }
                }
                
                throw new RuntimeException("No valid image found in Stable Diffusion response");
            } else {
                throw new RuntimeException("Stable Diffusion API returned error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error during image generation: " + e.getMessage());
        }
    }
}
