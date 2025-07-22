package com.figmine.backend.repository;

import com.figmine.backend.model.Shape;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShapeRepository extends JpaRepository<Shape, String> {}