package com.symptomchecker.repository;

import com.symptomchecker.entity.MedicalKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalKnowledgeRepository extends JpaRepository<MedicalKnowledge, Long> {
    List<MedicalKnowledge> findByCategory(String category);
    
    @Query("SELECT m FROM MedicalKnowledge m WHERE m.content LIKE %:keyword% OR m.title LIKE %:keyword%")
    List<MedicalKnowledge> findByKeyword(@Param("keyword") String keyword);
}