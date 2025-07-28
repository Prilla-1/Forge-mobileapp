package com.figmine.backend.controller;

import com.figmine.backend.dto.*;
import com.figmine.backend.model.User;
import com.figmine.backend.repository.UserRepository;
import com.figmine.backend.service.AuthService;
import com.figmine.backend.service.EmailService;
import com.figmine.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
                    String token = jwtService.generateToken(user.getEmail(), user.getName());
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("token", token);
                    resp.put("name", user.getName());
                    resp.put("email", user.getEmail());
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }

    // ✅ Forgot Password Endpoint
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        String resetUrl = "https://figmine.vercel.app/reset-password?token=" + token; // customize
        emailService.sendResetLink(user.getEmail(), resetUrl);

        return ResponseEntity.ok("Password reset link sent");
    }

    // ✅ Reset Password Endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByResetToken(request.getToken());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(400).body("Invalid token");
        }

        User user = userOpt.get();
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body("Token expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successful");
    }
}
