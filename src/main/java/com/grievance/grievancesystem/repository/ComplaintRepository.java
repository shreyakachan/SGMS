package com.grievance.grievancesystem.repository;

import com.grievance.grievancesystem.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
}