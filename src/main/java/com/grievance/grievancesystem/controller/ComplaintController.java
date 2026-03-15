package com.grievance.grievancesystem.controller;

import com.grievance.grievancesystem.model.Complaint;
import com.grievance.grievancesystem.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService service;

    @GetMapping
    public List<Complaint> getAllComplaints(){
        return service.getAllComplaints();
    }

    @PostMapping
    public Complaint addComplaint(@RequestBody Complaint complaint){
        return service.saveComplaint(complaint);
    }
}