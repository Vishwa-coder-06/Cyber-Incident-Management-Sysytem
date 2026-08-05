package com.secureops.userservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.userservice.dto.RegisterRequest;
import com.secureops.userservice.dto.RegisterResponse;
import com.secureops.userservice.entity.User;
import com.secureops.userservice.repository.UserRepository;
import com.secureops.userservice.dto.LoginRequest;
import com.secureops.userservice.dto.LoginResponse;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public RegisterResponse registerUser(RegisterRequest request) {

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
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
    
    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {

            return new LoginResponse(
                    null,
                    null,
                    null,
                    "Email not found"
            );
        }

        if (!user.getPassword().equals(request.getPassword())) {

            return new LoginResponse(
                    null,
                    null,
                    null,
                    "Invalid Password"
            );
        }

        return new LoginResponse(

                "TEMP_TOKEN",
                user.getRole(),
                user.getFirstName() + " " + user.getLastName(),
                "Login Successful"

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

}