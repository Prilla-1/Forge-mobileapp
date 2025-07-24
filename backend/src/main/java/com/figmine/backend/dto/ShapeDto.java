package com.figmine.backend.dto;

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

    // Getters and setters...
     public static class Position {
        private int x;
        private int y;
        // getters and setters
    }

    public static class Style {
        private int width;
        private int height;
        private String backgroundColor;
        private int borderRadius;
        // more styling props if needed
        // getters and setters
    }
}

