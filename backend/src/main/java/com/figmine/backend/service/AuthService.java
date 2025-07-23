package com.figmine.backend.service;

import com.figmine.backend.dto.UserLoginRequest;
import com.figmine.backend.dto.UserSignupRequest;
import com.figmine.backend.model.User;
import com.figmine.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User signup(UserSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .avatarUrl(null)
                .onboardingComplete(false)
                .build();
        return userRepository.save(user);
    }

    public Optional<User> login(UserLoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }

    public void initiatePasswordReset(String email, JavaMailSender mailSender, String appUrl) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetPasswordToken(token);
            user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            // Send email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Password Reset Request");
            message.setText("To reset your password, click the link below:\n" +
                appUrl + "/reset-password?token=" + token);
            mailSender.send(message);
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findAll().stream()
            .filter(u -> token.equals(u.getResetPasswordToken()) && u.getResetPasswordTokenExpiry() != null && u.getResetPasswordTokenExpiry().isAfter(LocalDateTime.now()))
            .findFirst();
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetPasswordToken(null);
            user.setResetPasswordTokenExpiry(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
