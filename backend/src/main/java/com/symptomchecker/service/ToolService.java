package com.symptomchecker.service;

import com.symptomchecker.entity.User;
import com.symptomchecker.entity.Appointment;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class ToolService {

    private final AppointmentService appointmentService;
    private final UserService userService;

    public ToolService(AppointmentService appointmentService, UserService userService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
    }

    public Map<String, Object> bookAppointment(String patientUsername, String urgency) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            User patient = userService.findByUsername(patientUsername);
            List<User> doctors = userService.getDoctors();
            
            if (doctors.isEmpty()) {
                result.put("success", false);
                result.put("message", "No doctors available");
                return result;
            }
            
            User doctor = doctors.get(0); // Simple selection
            LocalDateTime appointmentTime = getNextAvailableSlot(urgency);
            
            Appointment appointment = appointmentService.bookAppointment(patient, doctor, appointmentTime);
            
            result.put("success", true);
            result.put("message", "Appointment booked successfully");
            result.put("appointmentId", appointment.getId());
            result.put("doctorName", doctor.getFullName());
            result.put("appointmentTime", appointmentTime.toString());
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Failed to book appointment: " + e.getMessage());
        }
        
        return result;
    }

    public Map<String, Object> checkEmergency(String symptoms) {
        Map<String, Object> result = new HashMap<>();
        
        String[] emergencyKeywords = {"chest pain", "difficulty breathing", "severe pain", 
                                    "unconscious", "bleeding", "stroke", "heart attack"};
        
        boolean isEmergency = false;
        for (String keyword : emergencyKeywords) {
            if (symptoms.toLowerCase().contains(keyword)) {
                isEmergency = true;
                break;
            }
        }
        
        result.put("isEmergency", isEmergency);
        result.put("recommendation", isEmergency ? 
            "URGENT: Seek immediate medical attention or call emergency services" :
            "Monitor symptoms and consider scheduling an appointment");
            
        return result;
    }

    public Map<String, Object> findNearbyPharmacy(String location) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Mock pharmacy data based on location
            List<Map<String, String>> pharmacies = List.of(
                Map.of("name", "CVS Pharmacy", "address", "123 Main St, " + location, "distance", "0.3 miles"),
                Map.of("name", "Walgreens", "address", "456 Oak Ave, " + location, "distance", "0.7 miles"),
                Map.of("name", "Rite Aid", "address", "789 Pine St, " + location, "distance", "1.1 miles"),
                Map.of("name", "Local Pharmacy", "address", "321 Elm St, " + location, "distance", "1.5 miles")
            );
            
            result.put("success", true);
            result.put("pharmacies", pharmacies);
            result.put("location", location);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return result;
    }

    private LocalDateTime getNextAvailableSlot(String urgency) {
        LocalDateTime now = LocalDateTime.now();
        
        if ("high".equalsIgnoreCase(urgency)) {
            return now.plusHours(2); // Same day for urgent
        } else {
            return now.plusDays(1).withHour(10).withMinute(0); // Next day
        }
    }
}