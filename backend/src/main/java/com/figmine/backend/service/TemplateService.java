package com.figmine.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.figmine.backend.dto.TemplateDto;
import com.figmine.backend.model.Template;
import com.figmine.backend.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class TemplateService {

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private ObjectMapper objectMapper;  // Automatically configured by Spring Boot

    public void saveTemplate(TemplateDto dto) {
        try {
            Template template = new Template();
            template.setId(dto.getId());
            template.setName(dto.getName());

            // Convert list to JSON string
            String shapesJson = objectMapper.writeValueAsString(dto.getShapes());
            String linesJson = objectMapper.writeValueAsString(dto.getLines());

            template.setShapes(shapesJson);
            template.setLines(linesJson);

            templateRepository.save(template);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save template", e);
        }
    }
    
    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Optional<Template> getTemplateById(String id) {
        return templateRepository.findById(id);
    }
}
