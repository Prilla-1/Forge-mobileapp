package com.figmine.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LineDto {
    private String id;
    private String startShapeId;
    private String endShapeId;
    private String label;
}
