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

export interface FeedbackRequest {
  facultyName: string;
  studentName: string;
  teachingQuality: number;
  communicationSkill: number;
  comment?: string;
}

export interface FeedbackResponse {
  id: number;
  facultyName: string;
  studentName: string;
  teachingQuality: number;
  communicationSkill: number;
  comment?: string;
  sentiment: string;
  createdAt: string;
}

export interface Report {
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

  async generateReport(request: ReportGenerationRequest): Promise<Report> {
    const response = await this.makeRequest<ReportGenerationResponse>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    // Backend returns { report: Report }, so extract the report object
    return response.report;
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

  async submitFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
    return this.makeRequest<FeedbackResponse>('/feedback', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getAllFeedback(): Promise<FeedbackResponse[]> {
    return this.makeRequest<FeedbackResponse[]>('/feedback', {
      method: 'GET',
    });
  }

  async getFeedbackByStudent(studentName: string): Promise<FeedbackResponse[]> {
    return this.makeRequest<FeedbackResponse[]>(`/feedback/student/${encodeURIComponent(studentName)}`, {
      method: 'GET',
    });
  }

  async getFeedbackByFaculty(facultyName: string): Promise<FeedbackResponse[]> {
    return this.makeRequest<FeedbackResponse[]>(`/feedback/faculty/${encodeURIComponent(facultyName)}`, {
      method: 'GET',
    });
  }

  async getAllReports(): Promise<Report[]> {
    return this.makeRequest<Report[]>('/reports', {
      method: 'GET',
    });
  }

  async getReportsByFaculty(facultyName: string): Promise<Report[]> {
    return this.makeRequest<Report[]>(`/reports/faculty/${encodeURIComponent(facultyName)}`, {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();
