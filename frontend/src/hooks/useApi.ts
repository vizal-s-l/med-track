import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineApi, healthMetricApi, apiHealthCheck, type Medicine, type HealthMetric } from '@/lib/api';
import { supabase } from '@/lib/supabase';

// Query keys
export const QUERY_KEYS = {
  medicines: ['medicines'] as const,
  healthMetrics: ['healthMetrics'] as const,
  healthCheck: ['healthCheck'] as const,
};

// Medicines hooks
export const useMedicines = () => {
  return useQuery({
    queryKey: QUERY_KEYS.medicines,
    queryFn: medicineApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: medicineApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicines });
    },
  });
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Medicine> }) =>
      medicineApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicines });
    },
  });
};

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: medicineApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.medicines });
    },
  });
};

// Health metrics hooks
export const useHealthMetrics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.healthMetrics,
    queryFn: healthMetricApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateHealthMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: healthMetricApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.healthMetrics });
    },
  });
};

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.healthCheck,
    queryFn: apiHealthCheck,
    refetchInterval: 30 * 1000, // Check every 30 seconds
    staleTime: 10 * 1000, // Consider data fresh for 10 seconds
  });
};

// Timing settings hooks
export const useTimingSettings = () => {
  return useQuery({
    queryKey: ['timingSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_timing_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
};

export const useUpdateTimingSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: {
      morning_time: string;
      afternoon_time: string;
      night_time: string;
      timezone: string;
    }) => {
      const { data, error } = await supabase
        .from('user_timing_settings')
        .upsert(settings)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timingSettings'] });
    },
  });
};

// Intake hooks
export interface Intake {
  id: string;
  medicine_id: string;
  scheduled_time: string;
  taken_time?: string;
  status: 'scheduled' | 'taken' | 'missed' | 'skipped';
  quantity: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  medicines?: {
    id: string;
    name: string;
    morning_qty: number;
    afternoon_qty: number;
    night_qty: number;
  };
}

export const useIntakes = (date?: string) => {
  return useQuery({
    queryKey: ['intakes', date],
    queryFn: async () => {
      let query = supabase
        .from('intakes')
        .select(`
          *,
          medicines (
            id,
            name,
            morning_qty,
            afternoon_qty,
            night_qty
          )
        `);

      if (date) {
        // Get intakes for a specific date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query = query
          .gte('scheduled_time', startOfDay.toISOString())
          .lte('scheduled_time', endOfDay.toISOString());
      }

      const { data, error } = await query.order('scheduled_time', { ascending: true });

      if (error) throw error;
      return data as Intake[];
    },
  });
};

export const useCreateIntake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intake: Omit<Intake, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('intakes')
        .insert(intake)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
    },
  });
};

export const useUpdateIntake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Intake>) => {
      const { data, error } = await supabase
        .from('intakes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
    },
  });
};