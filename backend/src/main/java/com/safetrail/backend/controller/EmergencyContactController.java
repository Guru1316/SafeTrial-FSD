package com.safetrail.backend.controller;

import com.safetrail.backend.model.EmergencyContact;
import com.safetrail.backend.service.EmergencyContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class EmergencyContactController {

    @Autowired
    private EmergencyContactService service;

    // ✅ Add contact
    @PostMapping
    public EmergencyContact addContact(@RequestBody EmergencyContact contact) {
        return service.addContact(contact);
    }

    // ✅ Get contacts for tourist
    @GetMapping("/{touristId}")
    public List<EmergencyContact> getContacts(@PathVariable Long touristId) {
        return service.getContacts(touristId);
    }
}