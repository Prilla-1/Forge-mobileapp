package com.figmine.backend.service;

import com.figmine.backend.dto.TemplateDto;
import com.figmine.backend.model.Template;

import java.util.List;
import java.util.Optional;

public interface TemplateService {
    void saveTemplate(TemplateDto dto);
    List<Template> getAllTemplates();
    Optional<Template> getTemplateById(String id);
    Optional<Template> getTemplateByName(String name);
}
