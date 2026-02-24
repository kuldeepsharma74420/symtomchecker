package com.symptomchecker.repository;

import com.symptomchecker.entity.Appointment;
import com.symptomchecker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(User doctor);
    List<Appointment> findByStatus(Appointment.Status status);
    long countByStatus(Appointment.Status status);
    List<Appointment> findByDoctorAndAppointmentDateAndStatus(User doctor, LocalDateTime appointmentDate, Appointment.Status status);
}