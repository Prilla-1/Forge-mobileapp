package com.figmine.backend.repository;

import com.figmine.backend.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TemplateRepository extends JpaRepository<Template, String> {
    Optional<Template> findByName(String name);
}
