package com.symptomchecker.repository;

import com.symptomchecker.entity.SymptomAnalysis;
import com.symptomchecker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SymptomAnalysisRepository extends JpaRepository<SymptomAnalysis, Long> {
    List<SymptomAnalysis> findByUser(User user);
    List<SymptomAnalysis> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT sa FROM SymptomAnalysis sa JOIN FETCH sa.user ORDER BY sa.createdAt DESC")
    List<SymptomAnalysis> findAllWithUser();
}