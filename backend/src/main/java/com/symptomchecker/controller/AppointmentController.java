package com.symptomchecker.controller;

import com.symptomchecker.entity.Appointment;
import com.symptomchecker.entity.User;
import com.symptomchecker.service.AppointmentService;
import com.symptomchecker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserService userService;

    public AppointmentController(AppointmentService appointmentService, UserService userService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> request, Authentication auth) {
        User patient = userService.findByUsername(auth.getName());
        if (patient == null) {
            return ResponseEntity.badRequest().body("Patient not found");
        }

        Long doctorId = Long.valueOf(request.get("doctorId").toString());
        User doctor = userService.findById(doctorId);
        if (doctor == null || doctor.getRole() != User.Role.DOCTOR) {
            return ResponseEntity.badRequest().body("Doctor not found");
        }

        String dateString = request.get("appointmentDate").toString();
        LocalDateTime appointmentDate;
        try {
            // Handle ISO format with timezone
            appointmentDate = OffsetDateTime.parse(dateString).toLocalDateTime();
        } catch (Exception e) {
            // Fallback to simple LocalDateTime parsing
            appointmentDate = LocalDateTime.parse(dateString);
        }
        String notes = request.get("notes") != null ? request.get("notes").toString() : null;
        
        try {
            Appointment appointment = appointmentService.bookAppointment(patient, doctor, appointmentDate, notes);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Time slot is not available")) {
                return ResponseEntity.badRequest().body("This time slot is not available. Please choose a different time.");
            }
            return ResponseEntity.badRequest().body("Failed to book appointment");
        }
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<?> getMyAppointments(Authentication auth) {
        User user = userService.findByUsername(auth.getName());
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<Appointment> appointments;
        if (user.getRole() == User.Role.DOCTOR) {
            appointments = appointmentService.getDoctorAppointments(user);
        } else {
            appointments = appointmentService.getPatientAppointments(user);
        }
        
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors() {
        List<User> doctors = userService.getDoctors();
        return ResponseEntity.ok(doctors);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Appointment.Status status = Appointment.Status.valueOf(request.get("status"));
        Appointment updated = appointmentService.updateAppointmentStatus(id, status);
        
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/check-slot")
    public ResponseEntity<?> checkSlotAvailability(@RequestParam Long doctorId, @RequestParam String appointmentDate) {
        User doctor = userService.findById(doctorId);
        if (doctor == null || doctor.getRole() != User.Role.DOCTOR) {
            return ResponseEntity.badRequest().body("Doctor not found");
        }

        LocalDateTime dateTime;
        try {
            dateTime = OffsetDateTime.parse(appointmentDate).toLocalDateTime();
        } catch (Exception e) {
            dateTime = LocalDateTime.parse(appointmentDate);
        }

        boolean available = appointmentService.isSlotAvailable(doctor, dateTime);
        return ResponseEntity.ok(Map.of("available", available));
    }
}