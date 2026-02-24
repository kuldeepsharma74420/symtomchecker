package com.symptomchecker.controller;

import com.symptomchecker.dto.SymptomRequest;
import com.symptomchecker.entity.SymptomAnalysis;
import com.symptomchecker.entity.User;
import com.symptomchecker.service.SymptomAnalysisService;
import com.symptomchecker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/symptoms")
@CrossOrigin(origins = "*")
public class SymptomController {

    private final SymptomAnalysisService symptomAnalysisService;
    private final UserService userService;

    public SymptomController(SymptomAnalysisService symptomAnalysisService, UserService userService) {
        this.symptomAnalysisService = symptomAnalysisService;
        this.userService = userService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeSymptoms(@Valid @RequestBody SymptomRequest request, Authentication auth) {
        User user = userService.findByUsername(auth.getName());
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        SymptomAnalysis analysis = symptomAnalysisService.analyzeSymptoms(user, request.getSymptoms());
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getSymptomHistory(Authentication auth) {
        User user = userService.findByUsername(auth.getName());
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        List<SymptomAnalysis> history = symptomAnalysisService.getUserAnalyses(user);
        return ResponseEntity.ok(history);
    }
}