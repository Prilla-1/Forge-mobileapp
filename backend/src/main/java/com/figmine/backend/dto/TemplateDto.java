package com.figmine.backend.dto;

import java.util.List;

public class TemplateDto {

    private String id;
    private String name;
    private List<ShapeDto> shapes;
    private List<LineDto> lines;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ShapeDto> getShapes() {
        return shapes;
    }

    public void setShapes(List<ShapeDto> shapes) {
        this.shapes = shapes;
    }

    public List<LineDto> getLines() {
        return lines;
    }

    public void setLines(List<LineDto> lines) {
        this.lines = lines;
    }
}
