// API service for communicating with Java backend
import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;
const API_KEY = (import.meta as any).env?.VITE_API_KEY || '';

export interface SentimentAnalysisRequest {
  comment: string;
}

export interface SentimentAnalysisResponse {
  sentiment: string;
}

export interface ReportGenerationRequest {
  facultyName: string;
}

export interface ReportGenerationResponse {
  report: {
    id: number;
    facultyName: string;
    avgTeachingQuality: number;
    avgCommunicationSkill: number;
    sentimentSummary: string;
    totalFeedbackCount: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    createdAt: string;
  };
}

export interface ApiError {
  error: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async analyzeSentiment(request: SentimentAnalysisRequest): Promise<SentimentAnalysisResponse> {
    return this.makeRequest<SentimentAnalysisResponse>('/sentiment/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateReport(request: ReportGenerationRequest): Promise<ReportGenerationResponse> {
    return this.makeRequest<ReportGenerationResponse>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async checkHealth(): Promise<{ sentiment: string; reports: string }> {
    const [sentimentHealth, reportsHealth] = await Promise.all([
      this.makeRequest<{ message: string }>('/sentiment/health'),
      this.makeRequest<{ message: string }>('/reports/health'),
    ]);

    return {
      sentiment: sentimentHealth.message,
      reports: reportsHealth.message,
    };
  }
}

export const apiService = new ApiService();
