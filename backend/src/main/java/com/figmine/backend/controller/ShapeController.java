package com.figmine.backend.controller;
import com.figmine.backend.model.Shape;
import com.figmine.backend.repository.ShapeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // allow frontend access
public class ShapeController {

    @Autowired
    private ShapeRepository shapeRepository;

    @PostMapping("/save")
    public List<Shape> saveShapes(@RequestBody List<Shape> shapes) {
        return shapeRepository.saveAll(shapes);
    }

    @GetMapping("/shapes")
    public List<Shape> getShapes() {
        return shapeRepository.findAll();
    }
}