package com.figmine.backend.service;

import com.figmine.backend.dto.ProjectDto;
import com.figmine.backend.model.Project;
import com.figmine.backend.model.User;
import com.figmine.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;

    public List<ProjectDto> getProjects(User user) {
        return projectRepository.findByOwner(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectDto createProject(User user, ProjectDto dto) {
        Project project = Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .fileUrl(dto.getFileUrl())
                .owner(user)
                .build();
        return toDto(projectRepository.save(project));
    }

    @Transactional
    public ProjectDto updateProject(User user, Long id, ProjectDto dto) {
        Project project = projectRepository.findById(id).orElseThrow();
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setFileUrl(dto.getFileUrl());
        return toDto(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(User user, Long id) {
        Project project = projectRepository.findById(id).orElseThrow();
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        projectRepository.delete(project);
    }

    private ProjectDto toDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .fileUrl(project.getFileUrl())
                .build();
    }
}
