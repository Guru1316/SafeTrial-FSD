package com.safetrail.backend.controller;

import com.safetrail.backend.model.BlockRecord;
import com.safetrail.backend.repository.BlockRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {

    @Autowired
    private BlockRecordRepository repository;

    @GetMapping
    public List<BlockRecord> getAll() {
        return repository.findAll();
    }

    @GetMapping("/latest")
    public BlockRecord getLatest() {
        return repository.findTopByOrderByIdDesc();
    }
}
