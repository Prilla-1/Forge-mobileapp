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
        user.setName(name);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
    }

    @Transactional
    public void completeOnboarding(User user) {
        user.setOnboardingComplete(true);
        userRepository.save(user);
    }
}
