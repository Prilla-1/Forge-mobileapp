package com.figmine.backend.controller;
import com.figmine.backend.model.Shape;
import com.figmine.backend.repository.ShapeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ShapeController {

    private final ShapeRepository shapeRepository;

    public ShapeController(ShapeRepository shapeRepository) {
        this.shapeRepository = shapeRepository;
    }

    @PostMapping("/saveCanvas")
    public List<Shape> saveCanvas(@RequestBody List<Shape> shapes) {
        return shapeRepository.saveAll(shapes);
    }

    @GetMapping("/loadCanvas")
    public List<Shape> loadCanvas() {
        return shapeRepository.findAll();
    }

    @DeleteMapping("/clearCanvas")
    public void clearCanvas() {
        shapeRepository.deleteAll();
    }
}

