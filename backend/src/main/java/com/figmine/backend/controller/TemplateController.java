package com.figmine.backend.controller;

import com.figmine.backend.dto.TemplateDto;
import com.figmine.backend.model.Template;
import com.figmine.backend.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/templates")
public class TemplateController {

    private final TemplateService templateService;

    @Autowired
    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    // ✅ Save a new template from frontend
    @PostMapping
    public ResponseEntity<String> saveTemplate(@RequestBody TemplateDto templateDto) {
        templateService.saveTemplate(templateDto);
        return ResponseEntity.ok("Template saved successfully!");
    }

    // ✅ Get all saved templates
    @GetMapping
    public List<Template> getAllTemplates() {
        return templateService.getAllTemplates();
    }

    //  Get template by ID
   @GetMapping("/{id}")
public ResponseEntity<Template> getTemplateById(@PathVariable String id) {
    return templateService.getTemplateById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

}
