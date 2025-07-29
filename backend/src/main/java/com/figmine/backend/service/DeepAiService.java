package com.figmine.backend.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class DeepAiService {

    private static final String API_URL = "https://api.deepai.org/api/text2img";

    @Value("${deepai.api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    public String generateImageUrl(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Api-Key", apiKey); // ✅ use the key securely from properties
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("text", prompt);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> responseBody = response.getBody();
            return (String) responseBody.get("output_url");
        }

        throw new RuntimeException("Image generation failed");
    }
}
