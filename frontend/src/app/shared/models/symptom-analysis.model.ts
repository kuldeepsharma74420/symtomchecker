import { User } from './user.model';

export interface SymptomAnalysis {
  id: number;
  user: User;
  symptoms: string;
  aiSuggestion: string;
  createdAt: string;
}

export interface SymptomRequest {
  symptoms: string;
}