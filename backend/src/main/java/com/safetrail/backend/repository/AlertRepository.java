package com.safetrail.backend.repository;

import com.safetrail.backend.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}