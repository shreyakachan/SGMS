package com.grievance.grievancesystem.service;

import com.grievance.grievancesystem.model.Complaint;
import com.grievance.grievancesystem.repository.ComplaintRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository repository;

    // Save complaint
    public Complaint saveComplaint(Complaint complaint) {
        complaint.setStatus("Pending");
        return repository.save(complaint);
    }

    // Get all complaints
    public List<Complaint> getAllComplaints() {
        return repository.findAll();
    }
}