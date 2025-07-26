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
        if (prompt == null || prompt.isEmpty()) {
            return ResponseEntity.badRequest().body("Prompt is required.");
        }

        String imageUrl = imageGenerationService.generateImage(prompt);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }
}
