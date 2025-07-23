package com.figmine.backend.controller;

import com.figmine.backend.dto.UserLoginRequest;
import com.figmine.backend.dto.UserSignupRequest;
import com.figmine.backend.model.User;
import com.figmine.backend.service.AuthService;
import com.figmine.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;

    @Autowired
    private JavaMailSender mailSender;

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
                    resp.put("name", user.getName());
                    resp.put("email", user.getEmail());
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String email = body.get("email");
        String appUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        authService.initiatePasswordReset(email, mailSender, appUrl);
        return ResponseEntity.ok("If your email exists in our system, you will receive a password reset link.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        boolean success = authService.resetPassword(token, newPassword);
        if (success) {
            return ResponseEntity.ok("Password reset successful.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }
    }
}
