package com.figmine.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shape {
    @Id
    private String id;

    private String type;
    private float x;
    private float y;

    private Float width;
    private Float height;
    private String backgroundColor;
    private String borderColor;
    private Float borderWidth;
    private Float borderRadius;
    private Float rotation;

    private String color;
    private Float fontSize;
    private String fontFamily;
    private String fontWeight;
    private String fontStyle;
    private String fontColor;
    private String textDecorationLine;

    private String uri;
    private String text;
}
