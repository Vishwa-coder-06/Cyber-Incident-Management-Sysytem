package com.secureops.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secureops.userservice.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
    long countByStatus(String status);
    long countByRole(String role);
    
    List<User> findByRoleIgnoreCase(String role);

}