const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://medtrack-wndy.onrender.com/api' 
    : 'http://localhost:5000/api');

import { supabase } from './supabase';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
  };
};

export interface Medicine {
  id: string;
  name: string;
  totalQuantity: number;
  currentStock: number;
  price: number;
  morning_qty: number;
  afternoon_qty: number;
  night_qty: number;
  threshold: number;
  nextDue?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'blood_sugar' | 'weight' | string;
  value: string;
  unit: string;
  date: string;
  time: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical' | 'high' | 'low';
  notes?: string;
  created_at?: string;
}

// API functions for medicines
export const medicineApi = {
  async getAll(): Promise<Medicine[]> {
    const response = await fetch(`${API_BASE_URL}/medicines`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch medicines');
    return response.json();
  },

  async create(medicine: Omit<Medicine, 'id' | 'created_at' | 'updated_at'>): Promise<Medicine> {
    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(medicine),
    });
    if (!response.ok) throw new Error('Failed to create medicine');
    return response.json();
  },

  async update(id: string, medicine: Partial<Medicine>): Promise<Medicine> {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(medicine),
    });
    if (!response.ok) throw new Error('Failed to update medicine');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete medicine');
  },
};

// API functions for health metrics
export const healthMetricApi = {
  async getAll(): Promise<HealthMetric[]> {
    const response = await fetch(`${API_BASE_URL}/health-metrics`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch health metrics');
    return response.json();
  },

  async create(metric: Omit<HealthMetric, 'id' | 'created_at'>): Promise<HealthMetric> {
    const response = await fetch(`${API_BASE_URL}/health-metrics`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(metric),
    });
    if (!response.ok) throw new Error('Failed to create health metric');
    return response.json();
  },
};

// Health check
export const apiHealthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};