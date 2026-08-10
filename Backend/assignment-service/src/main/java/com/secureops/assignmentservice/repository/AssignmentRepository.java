package com.secureops.assignmentservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secureops.assignmentservice.entity.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long>{
	long countByStatus(String status);
	
	List<Assignment> findByAnalystId(Long analystId);

	long countByAnalystId(Long analystId);

	long countByAnalystIdAndStatusIgnoreCase(
	        Long analystId,
	        String status);

	long countByAnalystIdAndStatusIgnoreCaseAndResolvedAtAfter(
	        Long analystId,
	        String status,
	        LocalDateTime date);
	

}