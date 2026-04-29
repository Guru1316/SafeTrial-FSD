package com.safetrail.backend.service;

import com.safetrail.backend.blockchain.HashUtil;
import com.safetrail.backend.model.BlockRecord;
import com.safetrail.backend.repository.BlockRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BlockchainService {

    @Autowired
    private BlockRecordRepository repository;

    public void addBlock(String data) {

        BlockRecord lastBlock = repository.findTopByOrderByIdDesc();

        String previousHash = (lastBlock != null) ? lastBlock.getHash() : "0";

        String newHash = HashUtil.generateHash(
                data + previousHash + System.currentTimeMillis()
        );

        BlockRecord block = BlockRecord.builder()
                .previousHash(previousHash)
                .data(data)
                .hash(newHash)
                .timestamp(LocalDateTime.now())
                .build();

        repository.save(block);
    }
}