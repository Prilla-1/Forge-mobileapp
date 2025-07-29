package com.figmine.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.figmine.backend.dto.TemplateDto;
import com.figmine.backend.model.Template;
import com.figmine.backend.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class TemplateServiceImpl implements TemplateService {

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Method to adjust shape dimensions for text visibility
    private List<Map<String, Object>> adjustShapeDimensions(List<Map<String, Object>> shapes) {
        for (Map<String, Object> shape : shapes) {
            if (shape.containsKey("text") && shape.get("text") != null) {
                String text = shape.get("text").toString();
                if (!text.trim().isEmpty()) {
                    // Get current dimensions
                    Map<String, Object> style = (Map<String, Object>) shape.get("style");
                    if (style == null) {
                        style = Map.of();
                        shape.put("style", style);
                    }
                    
                    double currentWidth = ((Number) style.getOrDefault("width", 100)).doubleValue();
                    double currentHeight = ((Number) style.getOrDefault("height", 100)).doubleValue();
                    double fontSize = ((Number) shape.getOrDefault("fontSize", 16)).doubleValue();
                    
                    // Calculate minimum required dimensions
                    double minRequiredWidth = text.length() * fontSize * 1.2 + 40;
                    double minRequiredHeight = fontSize + 20;
                    
                    // Update dimensions if needed
                    if (currentWidth < minRequiredWidth) {
                        style.put("width", minRequiredWidth);
                    }
                    if (currentHeight < minRequiredHeight) {
                        style.put("height", minRequiredHeight);
                    }
                    
                    // Ensure fontColor is set for text shapes
                    if (!shape.containsKey("fontColor")) {
                        shape.put("fontColor", "#000000");
                    }
                }
            }
        }
        return shapes;
    }

    @Override
    public void saveTemplate(TemplateDto dto) {
        try {
            System.out.println("Saving template: " + dto.getName());
            System.out.println("Shapes: " + dto.getShapes());
            System.out.println("Lines: " + dto.getLines());

            Template template = new Template();
            template.setId(dto.getId());
            template.setName(dto.getName());
            template.setImageUrl(dto.getImageUrl()); 

            String shapesJson = objectMapper.writeValueAsString(dto.getShapes());
            String linesJson = objectMapper.writeValueAsString(dto.getLines());

            System.out.println("shapesJson = " + shapesJson);
            System.out.println("linesJson = " + linesJson);

            template.setShapes(shapesJson);
            template.setLines(linesJson);

            templateRepository.save(template);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save template", e);
        }
    }

    @Override
    public List<Template> getAllTemplates() {
        List<Template> templates = templateRepository.findAll();
        
        // Adjust dimensions for each template
        for (Template template : templates) {
            try {
                List<Map<String, Object>> shapes = objectMapper.readValue(
                    template.getShapes(), 
                    new TypeReference<List<Map<String, Object>>>() {}
                );
                
                // Adjust shape dimensions for text visibility
                List<Map<String, Object>> adjustedShapes = adjustShapeDimensions(shapes);
                
                // Update the template with adjusted shapes
                template.setShapes(objectMapper.writeValueAsString(adjustedShapes));
            } catch (Exception e) {
                System.err.println("Error adjusting template dimensions: " + e.getMessage());
                // Continue with original template if adjustment fails
            }
        }
        
        return templates;
    }

    @Override
    public Optional<Template> getTemplateById(String id) {
        Optional<Template> templateOpt = templateRepository.findById(id);
        if (templateOpt.isPresent()) {
            Template template = templateOpt.get();
            try {
                List<Map<String, Object>> shapes = objectMapper.readValue(
                    template.getShapes(), 
                    new TypeReference<List<Map<String, Object>>>() {}
                );
                
                // Adjust shape dimensions for text visibility
                List<Map<String, Object>> adjustedShapes = adjustShapeDimensions(shapes);
                
                // Update the template with adjusted shapes
                template.setShapes(objectMapper.writeValueAsString(adjustedShapes));
            } catch (Exception e) {
                System.err.println("Error adjusting template dimensions: " + e.getMessage());
            }
        }
        return templateOpt;
    }

    @Override
    public Optional<Template> getTemplateByName(String name) {
        Optional<Template> templateOpt = templateRepository.findByName(name);
        if (templateOpt.isPresent()) {
            Template template = templateOpt.get();
            try {
                List<Map<String, Object>> shapes = objectMapper.readValue(
                    template.getShapes(), 
                    new TypeReference<List<Map<String, Object>>>() {}
                );
                
                // Adjust shape dimensions for text visibility
                List<Map<String, Object>> adjustedShapes = adjustShapeDimensions(shapes);
                
                // Update the template with adjusted shapes
                template.setShapes(objectMapper.writeValueAsString(adjustedShapes));
            } catch (Exception e) {
                System.err.println("Error adjusting template dimensions: " + e.getMessage());
            }
        }
        return templateOpt;
    }
}
