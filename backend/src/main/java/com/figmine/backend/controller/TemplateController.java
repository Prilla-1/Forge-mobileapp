package com.figmine.backend.controller;

import com.figmine.backend.dto.TemplateDto;
import com.figmine.backend.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*") // allow frontend calls (adjust origin as needed)
@RequestMapping("/api/templates")
public class TemplateController {

    private final TemplateService templateService;

    @Autowired
    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @PostMapping
    public ResponseEntity<String> saveTemplate(@RequestBody TemplateDto template) {
        templateService.saveTemplate(template);
        return ResponseEntity.ok("Template saved successfully!");
    }
}
