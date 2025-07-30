package com.figmine.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.figmine.backend.dto.TemplateDto;
import com.figmine.backend.model.Template;
import com.figmine.backend.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateSeederController {

    private final TemplateRepository templateRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/seed")
    public ResponseEntity<?> seedTemplates(@RequestBody List<TemplateDto> templateDtos) {
        List<Template> templates = templateDtos.stream().map(dto -> {
            Template template = new Template();
            template.setId(dto.getId());
            template.setName(dto.getName());

            try {
                template.setShapes(objectMapper.writeValueAsString(dto.getShapes()));
                template.setLines(objectMapper.writeValueAsString(dto.getLines()));
            } catch (Exception e) {
                throw new RuntimeException("Error converting shapes/lines to JSON", e);
            }

            template.setImageUrl(dto.getImageUrl());
            return template;
        }).toList();

        templateRepository.saveAll(templates);
        return ResponseEntity.ok("Templates seeded successfully");
    }

    @PostMapping("/fix-ecommerce")
    public ResponseEntity<?> fixEcommerceTemplate() {
        try {
            // Create proper ecommerce flowchart template with correct positioning
            String ecommerceShapes = objectMapper.writeValueAsString(Arrays.asList(
                // Start - Product List Page
                createShape("shape1", "rectangle", 50, 50, 120, 60, "Go to product list page", "#87CEEB"),
                
                // Search and Navigation
                createShape("shape2", "rectangle", 200, 50, 120, 60, "Search for items", "#87CEEB"),
                createShape("shape3", "rectangle", 200, 150, 120, 60, "Use the menu and navigate", "#87CEEB"),
                createShape("shape4", "rectangle", 50, 150, 120, 60, "Review recommended item", "#87CEEB"),
                
                // Central Decision Point
                createShape("shape5", "diamond", 125, 250, 120, 80, "Identify item for purchase", "#DDA0DD"),
                
                // Shopping Cart Flow
                createShape("shape6", "rectangle", 50, 350, 120, 60, "Add item to shopping cart", "#87CEEB"),
                createShape("shape7", "rectangle", 50, 450, 120, 60, "Checkout process", "#87CEEB"),
                createShape("shape8", "rectangle", 50, 550, 120, 60, "Login/signup page", "#87CEEB"),
                createShape("shape9", "rectangle", 50, 650, 120, 60, "Review order confirmation", "#87CEEB")
            ));

            String ecommerceLines = objectMapper.writeValueAsString(Arrays.asList(
                createLine("line1", "shape1", "shape2"),
                createLine("line2", "shape2", "shape5"),
                createLine("line3", "shape3", "shape5"),
                createLine("line4", "shape4", "shape5"),
                createLine("line5", "shape5", "shape6"),
                createLine("line6", "shape6", "shape7"),
                createLine("line7", "shape7", "shape8"),
                createLine("line8", "shape8", "shape9")
            ));

            // Check if template already exists and update it, or create new one
            String templateId = "ecommerce-flowchart-1";
            Template existingTemplate = templateRepository.findById(templateId).orElse(new Template());
            
            existingTemplate.setId(templateId);
            existingTemplate.setName("Ecommerce Flowchart");
            existingTemplate.setShapes(ecommerceShapes);
            existingTemplate.setLines(ecommerceLines);
            existingTemplate.setImageUrl("https://example.com/ecommerce-template.png");

            templateRepository.save(existingTemplate);
            return ResponseEntity.ok("Ecommerce template fixed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fixing template: " + e.getMessage());
        }
    }

    private Object createShape(String id, String type, int x, int y, int width, int height, String text, String backgroundColor) {
        return Map.of(
            "id", id,
            "type", type,
            "position", Map.of("x", x, "y", y),
            "style", Map.of(
                "width", width,
                "height", height,
                "backgroundColor", backgroundColor,
                "borderRadius", 8,
                "color", "#000000",
                "fontSize", 12,
                "textAlign", "center"
            ),
            "text", text,
            "fontColor", "#000000"
        );
    }

    private Object createLine(String id, String startShapeId, String endShapeId) {
        return Map.of(
            "id", id,
            "startShapeId", startShapeId,
            "endShapeId", endShapeId
        );
    }
}

