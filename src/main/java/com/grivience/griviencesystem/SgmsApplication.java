package com.grievance.grievancesystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SgmsApplication {

    public static void main(String[] args) {
        // This line is what actually triggers Tomcat
        SpringApplication.run(SgmsApplication.class, args);
    }
}
