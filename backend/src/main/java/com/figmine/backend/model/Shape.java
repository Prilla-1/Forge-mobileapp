package com.figmine.backend.model;


import jakarta.persistence.*;

@Entity
@Table(name = "shapes")

public class Shape {
    @Id
    private String id;

    private String type;
    private float x;
    private float y;
    private Float width;
    private Float height;
    private String color;
    private String text;
    private Float fontSize;
    private String imageUri;
    private Float rotation;

    // Getters and setters
}

    

