package com.secureops.userservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.secureops.userservice.dto.RegisterRequest;
import com.secureops.userservice.dto.RegisterResponse;
import com.secureops.userservice.entity.User;
import com.secureops.userservice.service.UserService;
import com.secureops.common.dto.UserResponse;
import com.secureops.userservice.dto.LoginRequest;
import com.secureops.userservice.dto.LoginResponse;

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
    
    @GetMapping("/{id}")
    public UserResponse getUserResponseById(@PathVariable Long id){

        return userService.getUserResponseById(id);

    }


}