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
public class TemplateServiceImpl implements TemplateService {

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private ObjectMapper objectMapper;
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
        return templateRepository.findAll();
    }

    @Override
    public Optional<Template> getTemplateById(String id) {
        return templateRepository.findById(id);
    }

    @Override
    public Optional<Template> getTemplateByName(String name) {
        return templateRepository.findByName(name);
    }
}
