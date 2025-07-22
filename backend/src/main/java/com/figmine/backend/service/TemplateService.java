package com.figmine.backend.service;

import com.figmine.backend.dto.TemplateDto;
import org.springframework.stereotype.Service;

@Service
public class TemplateService {

    public void saveTemplate(TemplateDto template) {
        // You can log or persist to database here
        System.out.println("Received shapes: " + template.getShapes().size());
        System.out.println("Received lines: " + template.getLines().size());
    }
}
