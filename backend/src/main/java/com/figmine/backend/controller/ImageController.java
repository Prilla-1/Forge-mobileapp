package com.figmine.backend.controller;

import com.figmine.backend.service.DeepAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/image")
public class ImageController {

    @Autowired
    private DeepAiService deepAiService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateImage(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String imageUrl = deepAiService.generateImageUrl(prompt);

        Map<String, String> response = new HashMap<>();
        response.put("url", imageUrl);

        return ResponseEntity.ok(response);
    }
}
