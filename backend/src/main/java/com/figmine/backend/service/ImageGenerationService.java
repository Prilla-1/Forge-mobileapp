package com.figmine.backend.service;

import com.figmine.backend.config.ApiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class ImageGenerationService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final ApiConfig apiConfig;

    @Autowired
    public ImageGenerationService(ApiConfig apiConfig) {
        this.apiConfig = apiConfig;
    }

    public String generateImage(String prompt, String style) {
        if (prompt == null || prompt.isBlank()) {
            throw new IllegalArgumentException("Prompt must not be empty.");
        }

        String styledPrompt = (style != null && !style.equalsIgnoreCase("None"))
                ? prompt + ", in the style of " + style
                : prompt;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("api-key", apiConfig.getDeepaiToken());

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("text", styledPrompt);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.deepai.org/api/text2img",
                requestEntity,
                Map.class
        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("DeepAI API error: " + response.getStatusCode());
        }

        Object outputUrl = response.getBody().get("output_url");
        if (!(outputUrl instanceof String)) {
            throw new RuntimeException("Invalid response from DeepAI: 'output_url' is missing or invalid");
        }

        return fetchImageAsBase64((String) outputUrl);
    }

    private String fetchImageAsBase64(String imageUrl) {
        try (InputStream in = new URL(imageUrl).openStream()) {
            byte[] imageBytes = in.readAllBytes();
            return Base64.getEncoder().encodeToString(imageBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch or encode image from URL: " + imageUrl, e);
        }
    }
}
