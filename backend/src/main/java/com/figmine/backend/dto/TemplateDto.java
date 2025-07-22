package com.figmine.backend.dto;

import java.util.List;

public class TemplateDto {
    private List<ShapeDto> shapes;
    private List<LineDto> lines;

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

