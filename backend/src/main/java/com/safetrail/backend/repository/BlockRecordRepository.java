package com.safetrail.backend.repository;

import com.safetrail.backend.model.BlockRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockRecordRepository extends JpaRepository<BlockRecord, Long> {

    BlockRecord findTopByOrderByIdDesc();
}