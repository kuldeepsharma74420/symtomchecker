package com.symptomchecker.service;

import com.symptomchecker.entity.SymptomAnalysis;
import com.symptomchecker.entity.User;
import com.symptomchecker.repository.SymptomAnalysisRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class SymptomAnalysisService {

    private final SymptomAnalysisRepository repository;
    private final AzureAIService azureAIService;
    private final RAGService ragService;
    private final ToolService toolService;

    public SymptomAnalysisService(SymptomAnalysisRepository repository, AzureAIService azureAIService, RAGService ragService, ToolService toolService) {
        this.repository = repository;
        this.azureAIService = azureAIService;
        this.ragService = ragService;
        this.toolService = toolService;
    }

    public SymptomAnalysis analyzeSymptoms(User user, String symptoms) {
        // Get relevant context from RAG
        String context = ragService.retrieveRelevantContext(symptoms);
        
        // Check for emergency
        Map<String, Object> emergencyCheck = toolService.checkEmergency(symptoms);
        
        // Generate AI response with context and tools
        String aiSuggestion = azureAIService.analyzeWithRAGAndTools(symptoms, context, emergencyCheck, user.getUsername());
        
        SymptomAnalysis analysis = new SymptomAnalysis(user, symptoms, aiSuggestion);
        return repository.save(analysis);
    }

    public List<SymptomAnalysis> getUserAnalyses(User user) {
        return repository.findByUserOrderByCreatedAtDesc(user);
    }

    public long getTotalAnalyses() {
        return repository.count();
    }

    public List<SymptomAnalysis> getAllAnalyses() {
        return repository.findAllWithUser();
    }
}