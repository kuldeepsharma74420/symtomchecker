package com.symptomchecker.service;

import com.symptomchecker.entity.Appointment;
import com.symptomchecker.entity.User;
import com.symptomchecker.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public Appointment bookAppointment(User patient, User doctor, LocalDateTime appointmentDate, String notes) {
        // Check if slot is already taken
        if (!isSlotAvailable(doctor, appointmentDate)) {
            throw new RuntimeException("Time slot is not available");
        }
        
        Appointment appointment = new Appointment(patient, doctor, appointmentDate);
        appointment.setNotes(notes);
        return repository.save(appointment);
    }

    public Appointment bookAppointment(User patient, User doctor, LocalDateTime appointmentDate) {
        return bookAppointment(patient, doctor, appointmentDate, null);
    }

    public List<Appointment> getPatientAppointments(User patient) {
        return repository.findByPatient(patient);
    }

    public List<Appointment> getDoctorAppointments(User doctor) {
        return repository.findByDoctor(doctor);
    }

    public Appointment updateAppointmentStatus(Long appointmentId, Appointment.Status status) {
        Appointment appointment = repository.findById(appointmentId).orElse(null);
        if (appointment != null) {
            appointment.setStatus(status);
            return repository.save(appointment);
        }
        return null;
    }

    public long getTotalAppointments() {
        return repository.count();
    }

    public List<Appointment> getAllAppointments() {
        return repository.findAll();
    }

    public long getPendingAppointments() {
        return repository.countByStatus(Appointment.Status.SCHEDULED);
    }

    public long getCompletedAppointments() {
        return repository.countByStatus(Appointment.Status.COMPLETED);
    }

    public boolean isSlotAvailable(User doctor, LocalDateTime appointmentDate) {
        List<Appointment> existingAppointments = repository.findByDoctorAndAppointmentDateAndStatus(
            doctor, appointmentDate, Appointment.Status.SCHEDULED);
        System.out.println("Checking slot for doctor: " + doctor.getFullName() + " at " + appointmentDate);
        System.out.println("Found existing appointments: " + existingAppointments.size());
        return existingAppointments.isEmpty();
    }
}