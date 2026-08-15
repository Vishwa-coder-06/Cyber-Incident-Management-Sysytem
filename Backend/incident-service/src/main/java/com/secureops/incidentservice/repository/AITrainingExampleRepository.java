package com.secureops.incidentservice.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.secureops.incidentservice.entity.AITrainingExample;

public interface AITrainingExampleRepository extends JpaRepository<AITrainingExample, Long> {

    Optional<AITrainingExample> findByIncidentId(Long incidentId);

    List<AITrainingExample> findByApproved(boolean approved);

    boolean existsByIncidentId(Long incidentId);
}
