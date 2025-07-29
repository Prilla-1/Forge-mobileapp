package com.figmine.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.figmine.backend.dto.TemplateDto;
import com.figmine.backend.model.Template;
import com.figmine.backend.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateSeederController {

    private final TemplateRepository templateRepository;
@PostMapping("/seed")
public ResponseEntity<?> seedTemplates(@RequestBody List<TemplateDto> templateDtos) {
    List<Template> templates = templateDtos.stream().map(dto -> {
        Template template = new Template();
        template.setId(dto.getId());
        template.setName(dto.getName());

        try {
            ObjectMapper mapper = new ObjectMapper();
            template.setShapes(mapper.writeValueAsString(dto.getShapes()));
            template.setLines(mapper.writeValueAsString(dto.getLines()));
        } catch (Exception e) {
            throw new RuntimeException("Error converting shapes/lines to JSON", e);
        }

        template.setImageUrl(dto.getImageUrl());
        return template;
    }).toList();

    templateRepository.saveAll(templates);
    return ResponseEntity.ok("Templates seeded successfully");
}

}

