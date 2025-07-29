package com.figmine.backend.controller;

import com.figmine.backend.service.ImageGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/diffuse")
@RequiredArgsConstructor
public class DiffuseController {

    private final ImageGenerationService imageGenerationService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateImage(@RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");
        String style = body.getOrDefault("style", "");

        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required."));
        }

        try {
           String imageUrl = imageGenerationService.generateImage(prompt, style);
return ResponseEntity.ok(Map.of("image", imageUrl));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
