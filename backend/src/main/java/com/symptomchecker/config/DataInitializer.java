package com.symptomchecker.config;

import com.symptomchecker.service.RAGService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RAGService ragService;

    public DataInitializer(RAGService ragService) {
        this.ragService = ragService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize medical knowledge base
        ragService.initializeKnowledgeBase();
    }
}