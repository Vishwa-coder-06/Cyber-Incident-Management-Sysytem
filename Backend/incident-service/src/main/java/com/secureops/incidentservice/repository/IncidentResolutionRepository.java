package com.secureops.incidentservice.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.secureops.incidentservice.entity.IncidentResolution;

public interface IncidentResolutionRepository extends JpaRepository<IncidentResolution, Long> {

    Optional<IncidentResolution> findByIncidentId(Long incidentId);

    boolean existsByIncidentId(Long incidentId);
}
