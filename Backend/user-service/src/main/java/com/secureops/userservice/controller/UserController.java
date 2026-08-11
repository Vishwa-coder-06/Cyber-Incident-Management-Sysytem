package com.secureops.userservice.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.secureops.common.dto.UserResponse;
import com.secureops.userservice.dto.RegisterRequest;
import com.secureops.userservice.dto.RegisterResponse;
import com.secureops.userservice.dto.UserDashboardResponse;
import com.secureops.userservice.entity.User;
import com.secureops.userservice.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register User

    @PostMapping("/register")
    public RegisterResponse registerUser(@RequestBody RegisterRequest request) {

        return userService.registerUser(request);

    }
   

    // Get All Users

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get User By ID

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Update User

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // Delete User

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
    
    @GetMapping("/email/{email}")
    public UserResponse getUserByEmail(@PathVariable String email) {

        return userService.getUserByEmail(email);

    }
    
    @GetMapping("/dashboard")
    public UserDashboardResponse getDashboardData() {

        return userService.getDashboardData();
    }
    @GetMapping("/role/{role}")
    public List<UserResponse> getUsersByRole(
            @PathVariable String role) {

        return userService.getUsersByRole(role)
                .stream()
                .map(user -> new UserResponse(
                        user.getUserId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }
    
    @GetMapping("/me")
    public User getMyProfile(
            Authentication authentication) {

        return userService.getMyProfile(
                authentication.getName());
    }
    
    @PutMapping("/me")
    public User updateMyProfile(
            Authentication authentication,
            @RequestBody User user) {

        return userService.updateMyProfile(
                authentication.getName(),
                user);
    }
    
    @PostMapping(
            value = "/me/photo",
            consumes = "multipart/form-data"
    )
    public String uploadPhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        return userService.uploadProfilePhoto(
                authentication.getName(),
                file);
    }
    
    @GetMapping("/me/photo")
    public ResponseEntity<byte[]> getMyPhoto(
            Authentication authentication)
            throws IOException {

        return userService.getProfilePhoto(
                authentication.getName());
    }

}