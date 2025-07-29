package com.figmine.backend.controller;

import com.figmine.backend.dto.TemplateDto;
import com.figmine.backend.model.Template;
import com.figmine.backend.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/templates")
public class TemplateController {

    private final TemplateService templateService;

    @Autowired
    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    // ✅ Save a new template
    @PostMapping("/save")
    public ResponseEntity<String> saveTemplate(@RequestBody TemplateDto templateDto) {
        try {
            templateService.saveTemplate(templateDto);
            return ResponseEntity.ok("Template saved successfully");
        } catch (Exception e) {
            e.printStackTrace(); // shows error in backend logs
            String rootCause = e.getCause() != null ? e.getCause().toString() : e.toString();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save template: " + rootCause);
        }
    }

    // ✅ Get all templates
    @GetMapping
    public List<Template> getAllTemplates() {
        return templateService.getAllTemplates();
    }

    // ✅ Get template by ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Template> getTemplateById(@PathVariable String id) {
        Optional<Template> template = templateService.getTemplateById(id);
        return template.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get template by name
    @GetMapping("/name/{name}")
    public ResponseEntity<Template> getTemplateByName(@PathVariable String name) {
        Optional<Template> template = templateService.getTemplateByName(name);
        return template.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Upload image and return URL
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String folder = "uploads/";
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(folder + filename);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            String url = "http://10.212.110.165:8081/uploads/" + filename; // Replace localhost if needed
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Image upload failed");
        }
    }
}
