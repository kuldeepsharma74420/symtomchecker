package com.symptomchecker.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.*;
import com.azure.core.credential.AzureKeyCredential;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AzureAIService {

    @Value("${azure.ai.endpoint}")
    private String endpoint;

    @Value("${azure.ai.key}")
    private String key;

    @Value("${azure.ai.deployment-name}")
    private String deploymentName;

    private OpenAIClient client;

    @PostConstruct
    public void initClient() {
        try {
            System.out.println("Initializing Azure OpenAI client...");
            System.out.println("Endpoint: " + endpoint);
            System.out.println("Deployment: " + deploymentName);
            System.out.println("Key present: " + (key != null && !key.isEmpty()));

            client = new OpenAIClientBuilder()
                    .endpoint(endpoint)
                    .credential(new AzureKeyCredential(key))
                    .buildClient();
            
            System.out.println("✓ Azure OpenAI client initialized successfully");
        } catch (Exception e) {
            System.err.println("✗ Failed to create Azure client: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public String analyzeSymptoms(String symptoms) {
        try {
            List<ChatRequestMessage> messages = new ArrayList<>();
            messages.add(new ChatRequestSystemMessage(
                    "You are a medical AI assistant. Analyze the provided symptoms and provide general health suggestions. " +
                            "Always recommend consulting with a healthcare professional for proper diagnosis and treatment. " +
                            "Do not provide specific medical diagnoses. Provide practical advice and when to seek medical care."
            ));
            messages.add(new ChatRequestUserMessage("Patient symptoms: " + symptoms));

            ChatCompletionsOptions options = new ChatCompletionsOptions(messages);

            ChatCompletions completions = client.getChatCompletions(deploymentName, options);
            String aiResponse = completions.getChoices().get(0).getMessage().getContent();

            return aiResponse + "\n\n⚠️ IMPORTANT: This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation and treatment.";
        } catch (Exception e) {
            System.out.println("Azure AI Error: " + e.getMessage());
            e.printStackTrace();
            return getFallbackAnalysis(symptoms.toLowerCase());
        }
    }

    private String getFallbackAnalysis(String symptoms) {
        if (symptoms.contains("fever") || symptoms.contains("temperature")) {
            return "Possible Conditions: Viral/bacterial infection, flu\nRecommendations:\n• Rest and stay hydrated\n• Take fever reducers if needed\n• Seek medical care if fever exceeds 103°F\n\n⚠️ IMPORTANT: This is not a medical diagnosis. Please consult with a healthcare professional.";
        }
        if (symptoms.contains("headache") || symptoms.contains("head pain")) {
            return "Possible Conditions: Tension headache, migraine, dehydration\nRecommendations:\n• Rest in a dark, quiet room\n• Stay hydrated\n• Consider over-the-counter pain relievers\n\n⚠️ IMPORTANT: This is not a medical diagnosis. Please consult with a healthcare professional.";
        }
        return "General Recommendations:\n• Monitor symptoms closely\n• Stay hydrated and get adequate rest\n• Seek medical attention if symptoms worsen\n\n⚠️ IMPORTANT: This is not a medical diagnosis. Please consult with a healthcare professional.";
    }

    public String analyzeWithRAGAndTools(String symptoms, String context, Map<String, Object> emergencyCheck, String username) {
        try {
            System.out.println("\n=== Calling Azure AI with RAG ===");
            System.out.println("Symptoms: " + symptoms);
            System.out.println("Context length: " + context.length());
            
            List<ChatRequestMessage> messages = new ArrayList<>();

            String systemPrompt = "You are a medical AI assistant with access to medical knowledge and tools. " +
                    "Use the provided context and emergency assessment to give accurate advice. " +
                    "Context: " + context +
                    " Emergency Assessment: " + emergencyCheck.toString();

            messages.add(new ChatRequestSystemMessage(systemPrompt));
            messages.add(new ChatRequestUserMessage("Patient symptoms: " + symptoms));

            ChatCompletionsOptions options = new ChatCompletionsOptions(messages);

            System.out.println("Sending request to Azure OpenAI...");
            ChatCompletions completions = client.getChatCompletions(deploymentName, options);
            String aiResponse = completions.getChoices().get(0).getMessage().getContent();
            System.out.println("✓ Received AI response: " + aiResponse.substring(0, Math.min(100, aiResponse.length())) + "...");

            if ((Boolean) emergencyCheck.get("isEmergency")) {
                aiResponse = "🚨 EMERGENCY: " + emergencyCheck.get("recommendation") + "\n\n" + aiResponse;
            }

            return aiResponse + "\n\n⚠️ IMPORTANT: This is not a medical diagnosis. Please consult with a healthcare professional.";
        } catch (Exception e) {
            System.err.println("✗ Azure AI Error: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            System.err.println("Falling back to hardcoded response");
            return getFallbackWithContext(symptoms.toLowerCase(), context, emergencyCheck);
        }
    }

    private String getFallbackWithContext(String symptoms, String context, Map<String, Object> emergencyCheck) {
        StringBuilder response = new StringBuilder();

        if ((Boolean) emergencyCheck.get("isEmergency")) {
            response.append("🚨 EMERGENCY: ").append(emergencyCheck.get("recommendation")).append("\n\n");
        }

        if (!context.isEmpty()) {
            response.append(context).append("\n");
        }

        response.append(getFallbackAnalysis(symptoms));
        return response.toString();
    }
}