package com.symptomchecker.service;

import com.symptomchecker.entity.MedicalKnowledge;
import com.symptomchecker.repository.MedicalKnowledgeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RAGService {

    private final MedicalKnowledgeRepository repository;

    public RAGService(MedicalKnowledgeRepository repository) {
        this.repository = repository;
    }

    public String retrieveRelevantContext(String symptoms) {
        // Simple keyword-based retrieval (can be enhanced with vector similarity)
        String[] keywords = symptoms.toLowerCase().split("\\s+");
        StringBuilder context = new StringBuilder();
        
        for (String keyword : keywords) {
            List<MedicalKnowledge> relevant = repository.findByKeyword(keyword);
            if (!relevant.isEmpty()) {
                context.append("Relevant medical information:\n");
                relevant.stream()
                    .limit(3) // Limit to top 3 results
                    .forEach(knowledge -> 
                        context.append("- ").append(knowledge.getTitle())
                               .append(": ").append(knowledge.getContent())
                               .append("\n"));
                break; // Use first matching keyword
            }
        }
        
        return context.toString();
    }

    public void initializeKnowledgeBase() {
        if (repository.count() == 0) {
            // Add sample medical knowledge
            repository.save(new MedicalKnowledge(
                "Fever Management", 
                "Fever is a common symptom. Rest, hydration, and fever reducers help. Seek medical care if fever exceeds 103°F or persists more than 3 days.",
                "symptoms"
            ));
            
            repository.save(new MedicalKnowledge(
                "Headache Types", 
                "Tension headaches are most common. Migraines cause severe pain with nausea. Cluster headaches are rare but intense. Rest in dark room helps.",
                "symptoms"
            ));
            
            repository.save(new MedicalKnowledge(
                "Cough Treatment", 
                "Dry coughs benefit from suppressants. Productive coughs should not be suppressed. Stay hydrated. See doctor if cough persists over 2 weeks.",
                "symptoms"
            ));
            
            repository.save(new MedicalKnowledge(
                "Emergency Signs", 
                "Seek immediate care for: chest pain, difficulty breathing, severe abdominal pain, high fever with stiff neck, sudden severe headache.",
                "emergency"
            ));
        }
    }
}