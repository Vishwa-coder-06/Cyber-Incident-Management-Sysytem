package com.secureops.userservice.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.secureops.common.dto.UserResponse;
import com.secureops.userservice.dto.RegisterRequest;
import com.secureops.userservice.dto.RegisterResponse;
import com.secureops.userservice.dto.UserDashboardResponse;
import com.secureops.userservice.entity.User;
import com.secureops.userservice.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;    
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }
    
    public RegisterResponse registerUser(RegisterRequest request) {

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));     
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());
        user.setPhone(request.getPhone());

        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getUserId(),
                savedUser.getFirstName() + " " + savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "User Registered Successfully"
        );
    }
    
    
    // Get All Users

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // Get User By ID

    public User getUserById(Long id) {

        return userRepository.findById(id).orElse(null);
    }

    // Update User

    public User updateUser(Long id, User updatedUser) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return null;
        }

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setPassword(updatedUser.getPassword());
        user.setRole(updatedUser.getRole());
        user.setDepartment(updatedUser.getDepartment());
        user.setPhone(updatedUser.getPhone());
        user.setStatus(updatedUser.getStatus());

        return userRepository.save(user);
    }

    // Delete User

    public void deleteUser(Long id) {

        userRepository.deleteById(id);
    }
    
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if(user == null){
            return null;
        }

        return new UserResponse(

                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()

        );

    }
    public UserResponse getUserResponseById(Long id){

        User user = userRepository.findById(id).orElse(null);

        if(user == null){
            return null;
        }

        return new UserResponse(

                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()

        );

    }
    
    public UserDashboardResponse getDashboardData() {

        long total = userRepository.count();

        long active =
                userRepository.countByStatus("ACTIVE");

        long analysts =
                userRepository.countByRole("ANALYST");

        long managers =
                userRepository.countByRole("MANAGER");

        long admins =
                userRepository.countByRole("ADMIN");

        return new UserDashboardResponse(
                total,
                active,
                analysts,
                managers,
                admins
        );
    }
    
    public List<User> getUsersByRole(String role) {

        return userRepository.findByRoleIgnoreCase(role);
    }
    
    public String uploadProfilePhoto(
            String email,
            MultipartFile file)
            throws IOException {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"));

        if (file.isEmpty()) {
            throw new RuntimeException(
                    "Please select an image");
        }

        String originalName =
                file.getOriginalFilename();

        String extension = "";

        if (originalName != null &&
                originalName.contains(".")) {

            extension =
                    originalName.substring(
                            originalName.lastIndexOf("."));
        }

        String fileName =
                user.getUserId() + extension;

        Path uploadPath =
                Paths.get("uploads/profiles");

        Files.createDirectories(uploadPath);

        Path filePath =
                uploadPath.resolve(fileName);

        Files.write(
                filePath,
                file.getBytes());

        user.setProfilePhoto(fileName);

        userRepository.save(user);

        return fileName;
    }
    
    public ResponseEntity<byte[]> getProfilePhoto(
            String email)
            throws IOException {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"));

        if (user.getProfilePhoto() == null) {

            return ResponseEntity.notFound()
                    .build();
        }

        Path path =
                Paths.get("uploads/profiles")
                        .resolve(user.getProfilePhoto());

        if (!Files.exists(path)) {

            return ResponseEntity.notFound()
                    .build();
        }

        byte[] image =
                Files.readAllBytes(path);

        String contentType =
                Files.probeContentType(path);

        return ResponseEntity.ok()
                .header(
                        "Content-Type",
                        contentType != null
                                ? contentType
                                : "image/jpeg")
                .body(image);
    }
    
    public User getMyProfile(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User Not Found"));
    }
    
    public User updateMyProfile(
            String email,
            User updatedUser) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"));

        user.setFirstName(
                updatedUser.getFirstName());

        user.setLastName(
                updatedUser.getLastName());

        user.setDepartment(
                updatedUser.getDepartment());

        return userRepository.save(user);
    }
    
    public void changePassword(
            String email,
            com.secureops.userservice.dto.ChangePasswordRequest request) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"));

        if (request.getCurrentPassword() == null ||
                !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {

            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 4) {

            throw new RuntimeException("New password must be at least 4 characters long");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    public List<User> searchUsers(String keyword) {

        return userRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword);
    }
}