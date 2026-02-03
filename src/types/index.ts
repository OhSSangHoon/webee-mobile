// User types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  cultivationType?: string;
  cropName?: string;
  cultivationAddress?: string;
  isSeller?: boolean;
  isAdmin?: boolean;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
}

// API 공통 응답 형식
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface SignInResponseData {
  name: string;
}

export interface AuthResponse {
  user: User;
}

// Diagnosis types
export interface Diagnosis {
  id: string;
  userId: string;
  imageUrl: string;
  diseaseName: string;
  severity: 'healthy' | 'warning' | 'critical';
  confidence: string;
  symptoms: string;
  recommendations: string;
  createdAt: string;
}

export interface DiagnosisRequest {
  imageUrl?: string;
  imageBase64?: string;
}

export interface DiagnosisResponse {
  diagnosis: Diagnosis;
  result: {
    diseaseName: string;
    diseaseNameEn: string;
    severity: 'healthy' | 'warning' | 'critical';
    confidence: number;
    symptoms: string;
    recommendations: string;
  };
}

// Recommendation types
export interface Recommendation {
  id: string;
  userId: string;
  cropType: string;
  cultivationMethod: string;
  area: number;
  region: string;
  budget: number;
  results: string;
  helpful: boolean | null;
  createdAt: string;
}

export interface RecommendationRequest {
  cropType: string;
  cultivationMethod: string;
  area: number;
  region: string;
  budget: number;
}

export interface RecommendationResponse {
  recommendation: Recommendation;
  results: string;
}

// Weather types
export interface Weather {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  beeActivitySuitability: 'excellent' | 'moderate' | 'poor';
  suitabilityMessage: string;
}

// User stats
export interface UserStats {
  totalDiagnoses: number;
  totalRecommendations: number;
  healthyBees: number;
  diseaseDetected: number;
}
