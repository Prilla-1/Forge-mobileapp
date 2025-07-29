package com.figmine.backend.controller;

import com.figmine.backend.dto.SettingsLayoutDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings-layout")
public class SettingsLayoutController {

    @PostMapping("/save")
    public ResponseEntity<?> saveLayout(@RequestBody SettingsLayoutDto layoutDto) {
        // Logging the received layout (for debug)
        System.out.println("Received layout: " + layoutDto);
        
        // TODO: Save layout to DB here
        
        return ResponseEntity.ok("Layout saved successfully");
    }
}
