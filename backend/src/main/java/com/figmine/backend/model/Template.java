package com.figmine.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Template {
    
    @Id
    private String id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String shapes; // Store JSON string of shapes

    @Column(columnDefinition = "TEXT")
    private String lines;  // Store JSON string of lines
    
}
