package com.secureops.assignmentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secureops.assignmentservice.entity.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long>{

}