package com.figmine.backend.service;

import com.figmine.backend.dto.UserProfileResponse;
import com.figmine.backend.model.User;
import com.figmine.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .onboardingComplete(user.isOnboardingComplete())
                .build();
    }

    @Transactional
    public void updateProfile(User user, String name, String avatarUrl) {
        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }

        if (avatarUrl != null && !avatarUrl.trim().isEmpty()) {
            user.setAvatarUrl(avatarUrl);
        }

        userRepository.save(user);

        // Optional: log update
        // log.info("Updated profile for user ID {}", user.getId());
    }

    @Transactional
    public void completeOnboarding(User user) {
        if (!user.isOnboardingComplete()) {
            user.setOnboardingComplete(true);
            userRepository.save(user);
        }

        // Optional: log onboarding status
        // log.info("Onboarding completed for user ID {}", user.getId());
    }
}
