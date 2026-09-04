package com.symptomchecker.service;

import com.symptomchecker.entity.Pharmacy;
import com.symptomchecker.repository.PharmacyRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PharmacyService {
    
    private final PharmacyRepository pharmacyRepository;

    public PharmacyService(PharmacyRepository pharmacyRepository) {
        this.pharmacyRepository = pharmacyRepository;
    }

    public Pharmacy addPharmacy(Pharmacy pharmacy) {
        return pharmacyRepository.save(pharmacy);
    }

    public List<Pharmacy> getAllPharmacies() {
        return pharmacyRepository.findAll();
    }

    public long getTotalPharmacies() {
        return pharmacyRepository.count();
    }
}