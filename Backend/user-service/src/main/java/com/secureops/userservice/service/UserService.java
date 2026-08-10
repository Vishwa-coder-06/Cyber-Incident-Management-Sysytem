package com.secureops.userservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
}