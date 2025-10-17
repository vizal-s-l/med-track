import { callApi, supabase } from './supabase';

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
  type: 'blood_pressure' | 'blood_sugar' | 'combined';
  recorded_at: string;
  systolic?: number;
  diastolic?: number;
  heartbeat?: number;
  sugar_context?: 'fasting' | 'after_food' | 'random';
  sugar_value?: number;
  notes?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'high' | 'low';
  created_at?: string;
}

// API functions for medicines
export const medicineApi = {
  async getAll(): Promise<Medicine[]> {
    return callApi('/medicines');
  },

  async create(medicine: Omit<Medicine, 'id' | 'created_at' | 'updated_at'>): Promise<Medicine> {
    return callApi('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicine),
    });
  },

  async update(id: string, medicine: Partial<Medicine>): Promise<Medicine> {
    return callApi(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicine),
    });
  },

  async delete(id: string): Promise<void> {
    await callApi(`/medicines/${id}`, {
      method: 'DELETE',
    });
  },
};

// API functions for health metrics
export const healthMetricApi = {
  async getAll(): Promise<HealthMetric[]> {
    return callApi('/health-metrics');
  },

  async create(metric: Omit<HealthMetric, 'id' | 'created_at'>): Promise<HealthMetric> {
    return callApi('/health-metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
    });
  },
};

// Health check
export const apiHealthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `${(
        import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD
          ? 'https://medtrack-wndy.onrender.com/api'
          : 'http://localhost:5000/api')
      ).replace('/api', '')}/api/health`
    );
    return response.ok;
  } catch {
    return false;
  }
};