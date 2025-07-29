package com.figmine.backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/generate")
    public ResponseEntity<?> generateImage(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String style = request.get("style");

        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }

        // Append style to the prompt
        if (style != null && !style.trim().isEmpty()) {
            prompt += " in " + style + " style";
        }

        try {
            // Call DeepSeek backend directly
            String deepseekEndpoint = "http://localhost:8081/api/deepseek/generate"; // Adjust if different
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> payload = Map.of("prompt", prompt);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(deepseekEndpoint, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(Map.of("error", "Failed to generate image with DeepSeek"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Exception: " + e.getMessage()));
        }
    }
}
