package com.symptomchecker.controller;

import com.symptomchecker.entity.User;
import com.symptomchecker.entity.Pharmacy;
import com.symptomchecker.service.UserService;
import com.symptomchecker.service.AppointmentService;
import com.symptomchecker.service.SymptomAnalysisService;
import com.symptomchecker.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserService userService;
    private final AppointmentService appointmentService;
    private final SymptomAnalysisService symptomAnalysisService;
    private final PharmacyService pharmacyService;

    public AdminController(UserService userService, AppointmentService appointmentService, SymptomAnalysisService symptomAnalysisService, PharmacyService pharmacyService) {
        this.userService = userService;
        this.appointmentService = appointmentService;
        this.symptomAnalysisService = symptomAnalysisService;
        this.pharmacyService = pharmacyService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {

        Map<String, Object> stats = new HashMap<>();
        long totalAppointments = appointmentService.getTotalAppointments();
        System.out.println("Total appointments from service: " + totalAppointments);
        
        stats.put("totalUsers", userService.getTotalUsers());
        stats.put("totalDoctors", userService.getDoctors().size());
        stats.put("totalAppointments", totalAppointments);
        stats.put("totalAnalyses", symptomAnalysisService.getTotalAnalyses());
        stats.put("totalPharmacies", pharmacyService.getTotalPharmacies());
        stats.put("pendingAppointments", appointmentService.getPendingAppointments());
        stats.put("completedAppointments", appointmentService.getCompletedAppointments());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/analyses")
    public ResponseEntity<?> getAllAnalyses() {
        return ResponseEntity.ok(symptomAnalysisService.getAllAnalyses());
    }

    @PostMapping("/doctors")
    public ResponseEntity<?> addDoctor(@RequestBody Map<String, String> request) {

        User doctor = new User(
            request.get("username"),
            request.get("email"),
            request.get("password"),
            request.get("fullName")
        );
        doctor.setRole(User.Role.DOCTOR);
        doctor.setPhone(request.get("phone"));
        
        User savedDoctor = userService.registerUser(doctor);
        return ResponseEntity.ok(savedDoctor);
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable Long id) {
        return ResponseEntity.ok("User suspended successfully");
    }

    @PostMapping("/pharmacies")
    public ResponseEntity<?> addPharmacy(@RequestBody Map<String, String> request) {

        Pharmacy pharmacy = new Pharmacy(
            request.get("name"),
            request.get("address"),
            request.get("phone"),
            request.get("email"),
            request.get("operatingHours")
        );
        
        Pharmacy savedPharmacy = pharmacyService.addPharmacy(pharmacy);
        return ResponseEntity.ok(savedPharmacy);
    }

    @GetMapping("/pharmacies")
    public ResponseEntity<?> getAllPharmacies() {
        return ResponseEntity.ok(pharmacyService.getAllPharmacies());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }
}