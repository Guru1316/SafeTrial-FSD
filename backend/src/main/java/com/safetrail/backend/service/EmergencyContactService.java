package com.safetrail.backend.service;

import com.safetrail.backend.model.EmergencyContact;
import com.safetrail.backend.repository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyContactService {

    @Autowired
    private EmergencyContactRepository repository;

    // ✅ Add Contact
    public EmergencyContact addContact(EmergencyContact contact) {
        return repository.save(contact);
    }

    // ✅ Get Contacts by Tourist
    public List<EmergencyContact> getContacts(Long touristId) {
        return repository.findByTouristId(touristId);
    }
}