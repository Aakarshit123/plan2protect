const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiUser {
  uid: string;
  email: string;
  name: string;
  plan: 'free' | 'bundle' | 'yearly' | 'monthly';
  isAdmin: boolean;
  createdAt: string;
  lastLogin: string;
  totalRevenue: number;
  monthlyRevenue: number;
  assessmentsCompleted: number;
  storageUsed: number;
  lastAssessmentDate?: string;
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  planStartDate?: string;
  planEndDate?: string;
}

export interface ApiAssessment {
  id: string;
  user_id: string;
  image_url: string;
  status: string;
  created_at: string;
  risk_score?: number;
  recommendations?: string[];
}

export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalAssessments: number;
  totalStorageUsed: number;
  planDistribution: Record<string, number>;
  lastUpdated: string;
}

export interface PlanConfig {
  name: string;
  price: number;
  assessments_limit: number;
  storage_limit: number;
  features: string[];
}

export interface UserLimits {
  user: ApiUser;
  plan: PlanConfig;
  usage: {
    assessments: {
      used: number;
      limit: number;
      remaining: number;
    };
    storage: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string; users_count: number; assessments_count: number; admin_emails: string[] }> {
    return this.request('/health');
  }

  // Plans
  async getPlans(): Promise<{ plans: Record<string, PlanConfig> }> {
    return this.request('/plans');
  }

  // User Management
  async createUser(name: string, email: string, plan: string = 'free'): Promise<{ success: boolean; message: string; user_id: string; user: ApiUser }> {
    return this.request('/users/create', {
      method: 'POST',
      body: JSON.stringify({ name, email, plan }),
    });
  }

  async loginUser(email: string): Promise<{ success: boolean; message: string; user: ApiUser }> {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getUser(email: string): Promise<{ user: ApiUser }> {
    return this.request(`/users/${email}`);
  }

  async getAllUsers(): Promise<{ users: ApiUser[]; total_count: number; admin_count: number; regular_count: number }> {
    return this.request('/users');
  }

  async upgradeUserPlan(userId: string, plan: string): Promise<{ success: boolean; message: string; user: ApiUser }> {
    return this.request(`/users/${userId}/plan`, {
      method: 'PUT',
      body: JSON.stringify({ user_id: userId, plan }),
    });
  }

  async updateUserProfile(userId: string, profile: { name?: string; plan?: string }): Promise<{ success: boolean; message: string; user: ApiUser }> {
    return this.request(`/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async updateUserStorage(userId: string, storageUsed: number): Promise<{ success: boolean; message: string; user: ApiUser }> {
    return this.request(`/users/${userId}/update-storage`, {
      method: 'POST',
      body: JSON.stringify({ storage_used: storageUsed }),
    });
  }

  async getUserLimits(userId: string): Promise<UserLimits> {
    return this.request(`/user-limits/${userId}`);
  }

  async checkAdminStatus(email: string): Promise<{ isAdmin: boolean }> {
    return this.request(`/check-admin/${email}`);
  }

  // Assessment Management
  async createAssessment(userId: string, image: File): Promise<{ success: boolean; message: string; assessment: ApiAssessment }> {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('image', image);

    const response = await fetch(`${API_BASE_URL}/assessments/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getUserAssessments(userId: string): Promise<{ assessments: ApiAssessment[]; total_count: number }> {
    return this.request(`/assessments/user/${userId}`);
  }

  async getAssessment(assessmentId: string): Promise<{ assessment: ApiAssessment }> {
    return this.request(`/assessments/${assessmentId}`);
  }

  async completeAssessment(assessmentId: string): Promise<{ success: boolean; message: string; assessment: ApiAssessment }> {
    return this.request(`/assessments/${assessmentId}/complete`, {
      method: 'PUT',
    });
  }

  // Analytics
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    return this.request('/analytics/overview');
  }

  async getUsersAnalytics(): Promise<{ users: ApiUser[]; totalCount: number; adminCount: number; regularCount: number }> {
    return this.request('/analytics/users');
  }

  // Utility methods
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.log('Backend not available:', error);
      return false;
    }
  }

  // File upload helper
  async uploadFile(file: File, userId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const result = await response.json();
    return result.file_url;
  }
}

export const apiService = new ApiService(); 