package com.figmine.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShapeDto {
    private String id;
    private String type;
    private Position position;
    private Style style;
    private Boolean isVisible;
    private Boolean isLocked;
    private String color;
    private Integer fontSize;
    private String fontColor;
    private String borderColor;
    private String uri;
    private String text;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Position {
        private int x;
        private int y;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Style {
        private int width;
        private int height;
        private String backgroundColor;
        private int borderRadius;
    }
}
