package com.figmine.backend.controller;

import com.figmine.backend.dto.UserLoginRequest;
import com.figmine.backend.dto.UserSignupRequest;
import com.figmine.backend.model.User;
import com.figmine.backend.service.AuthService;
import com.figmine.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupRequest request) {
        User user = authService.signup(request);
        String token = jwtService.generateToken(user.getEmail());
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        return authService.login(request)
                .<ResponseEntity<?>>map(user -> {
                    String token = jwtService.generateToken(user.getEmail());
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("token", token);
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
}
