import { API_URL } from '../config/constants';
import type { 
  User, 
  UserCreate, 
  UserLogin, 
  UserProfile, 
  AuthResponse,
  Opportunity,
  OpportunityCreate,
  OpportunityUpdate,
  Application,
  ApplicationCreate
} from '../types';

// Helper function for API calls
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`API Error on ${endpoint}:`, error);
    throw new Error(error.detail || JSON.stringify(error) || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  signup: (data: UserCreate) => apiCall<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  login: (data: UserLogin) => apiCall<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// Profile API
export const profileAPI = {
  getMe: () => apiCall<User>('/profile/me'),
  
  updateMe: (data: UserProfile) => apiCall<User>('/profile/me', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  toggleMode: (mode: 'hustler' | 'builder') => apiCall<User>('/profile/mode', {
    method: 'POST',
    body: JSON.stringify({ mode })
  })
};

// Opportunities API
export const opportunitiesAPI = {
  getAll: (params: Record<string, string | number> = {}) => {
    const queryString = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
    return apiCall<Opportunity[]>(`/opportunities${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: number) => apiCall<Opportunity>(`/opportunities/${id}`),
  
  create: (data: OpportunityCreate) => apiCall<Opportunity>('/opportunities', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: (id: number, data: OpportunityUpdate) => apiCall<Opportunity>(`/opportunities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (id: number) => apiCall<void>(`/opportunities/${id}`, {
    method: 'DELETE'
  }),
  
  apply: (id: number, message: string) => apiCall<Application>(`/opportunities/${id}/apply`, {
    method: 'POST',
    body: JSON.stringify({ message })
  }),
  
  getApplications: (id: number) => apiCall<Application[]>(`/opportunities/${id}/applications`)
};

// Network API
export const networkAPI = {
  getUsers: (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall<User[]>(`/network${queryString ? `?${queryString}` : ''}`);
  },
  
  getUserById: (id: number) => apiCall<User>(`/network/${id}`),
  
  getMyApplications: () => apiCall<Application[]>('/network/applications/my')
};