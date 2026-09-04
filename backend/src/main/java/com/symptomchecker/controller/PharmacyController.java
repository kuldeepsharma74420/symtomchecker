package com.symptomchecker.controller;

import com.symptomchecker.service.ToolService;
import com.symptomchecker.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy")
@CrossOrigin(origins = "*")
public class PharmacyController {

    private final ToolService toolService;
    private final PharmacyService pharmacyService;

    public PharmacyController(ToolService toolService, PharmacyService pharmacyService) {
        this.toolService = toolService;
        this.pharmacyService = pharmacyService;
    }

    @PostMapping("/find")
    public ResponseEntity<?> findNearbyPharmacies(@RequestBody Map<String, String> request) {
        try {
            String location = request.get("location");
            System.out.println("Finding pharmacies for location: " + location);
            Map<String, Object> result = toolService.findNearbyPharmacy(location);
            System.out.println("Pharmacy search result: " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("Pharmacy search error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to find pharmacies: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getAllPharmacies() {
        return ResponseEntity.ok(pharmacyService.getAllPharmacies());
    }
}