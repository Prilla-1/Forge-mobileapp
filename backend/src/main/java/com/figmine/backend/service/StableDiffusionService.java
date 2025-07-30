package com.figmine.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class StableDiffusionService {

    @Value("${stablediffusion.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateImageBase64(String prompt) {
        String url = apiUrl + "/sdapi/v1/txt2img";

        Map<String, Object> payload = new HashMap<>();
        payload.put("prompt", prompt);
        payload.put("steps", 20);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode jsonNode = mapper.readTree(response.getBody());

                // Base64 image is in: images[0]
                return jsonNode.get("images").get(0).asText();
            } else {
                throw new RuntimeException("Failed: " + response.getStatusCode());
            }

        } catch (Exception e) {
            throw new RuntimeException("Image generation failed: " + e.getMessage(), e);
        }
    }
}
