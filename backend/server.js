const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://medtrack-frontend.onrender.com' 
    : ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No auth header or invalid format');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    console.log('Validating token...');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.log('Token validation error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!user) {
      console.log('No user found for token');
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('User authenticated:', user.id);
    req.user = user;
    req.userToken = token; // Store the token for creating user-specific client
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || email.split('@')[0],
        }
      }
    });

    if (error) throw error;
    res.status(201).json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    res.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/logout', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateUser, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ user: req.user, profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Google OAuth
app.post('/api/auth/google', async (req, res) => {
  try {
    const { code } = req.body;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${req.protocol}://${req.get('host')}/auth/callback`
      }
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Medicines Routes
app.get('/api/medicines', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    const { data, error } = await userSupabase
      .from('medicines')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map snake_case database fields to camelCase for frontend
    const mappedData = data.map(medicine => ({
      id: medicine.id,
      name: medicine.name,
      totalQuantity: medicine.total_quantity,
      currentStock: medicine.current_stock,
      price: medicine.price,
      morning_qty: medicine.morning_qty,
      afternoon_qty: medicine.afternoon_qty,
      night_qty: medicine.night_qty,
      threshold: medicine.threshold,
      nextDue: medicine.next_due,
      notes: medicine.notes,
      created_at: medicine.created_at,
      updated_at: medicine.updated_at,
    }));

    res.json(mappedData);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

app.post('/api/medicines', authenticateUser, async (req, res) => {
  try {
    console.log('Creating medicine for user:', req.user.id);
    console.log('Request body:', req.body);

    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    // Map camelCase fields to snake_case database columns
    const medicineData = {
      user_id: req.user.id,
      name: req.body.name,
      total_quantity: req.body.totalQuantity,
      current_stock: req.body.currentStock,
      price: req.body.price,
      morning_qty: req.body.morning_qty,
      afternoon_qty: req.body.afternoon_qty,
      night_qty: req.body.night_qty,
      threshold: req.body.threshold,
      notes: req.body.notes,
    };

    console.log('Inserting medicine data:', medicineData);

    const { data, error } = await userSupabase
      .from('medicines')
      .insert([medicineData])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('Medicine created successfully:', data);

    // Map response back to camelCase for frontend
    const mappedData = {
      id: data.id,
      name: data.name,
      totalQuantity: data.total_quantity,
      currentStock: data.current_stock,
      price: data.price,
      morning_qty: data.morning_qty,
      afternoon_qty: data.afternoon_qty,
      night_qty: data.night_qty,
      threshold: data.threshold,
      nextDue: data.next_due,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    res.status(201).json(mappedData);
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ error: 'Failed to create medicine' });
  }
});

app.put('/api/medicines/:id', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    // Map camelCase fields to snake_case database columns
    const medicineData = {
      name: req.body.name,
      total_quantity: req.body.totalQuantity,
      current_stock: req.body.currentStock,
      price: req.body.price,
      morning_qty: req.body.morning_qty,
      afternoon_qty: req.body.afternoon_qty,
      night_qty: req.body.night_qty,
      threshold: req.body.threshold,
      notes: req.body.notes,
    };

    const { data, error } = await userSupabase
      .from('medicines')
      .update(medicineData)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id) // Ensure user can only update their own medicines
      .select()
      .single();

    if (error) throw error;

    // Map response back to camelCase for frontend
    const mappedData = {
      id: data.id,
      name: data.name,
      totalQuantity: data.total_quantity,
      currentStock: data.current_stock,
      price: data.price,
      morning_qty: data.morning_qty,
      afternoon_qty: data.afternoon_qty,
      night_qty: data.night_qty,
      threshold: data.threshold,
      nextDue: data.next_due,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    res.json(mappedData);
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ error: 'Failed to update medicine' });
  }
});

app.delete('/api/medicines/:id', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    const { error } = await userSupabase
      .from('medicines')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id); // Ensure user can only delete their own medicines

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
});

// Health Metrics Routes
app.get('/api/health-metrics', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    const { data, error } = await userSupabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ error: 'Failed to fetch health metrics' });
  }
});

app.post('/api/health-metrics', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    const metricData = {
      ...req.body,
      user_id: req.user.id,
    };

    const { data, error } = await userSupabase
      .from('health_metrics')
      .insert([metricData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating health metric:', error);
    res.status(500).json({ error: 'Failed to create health metric' });
  }
});

// Intake Routes
app.get('/api/intakes', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    const { date } = req.query;
    let query = userSupabase
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
      `)
      .eq('user_id', req.user.id)
      .order('scheduled_time', { ascending: true });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('scheduled_time', startOfDay.toISOString())
        .lte('scheduled_time', endOfDay.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching intakes:', error);
    res.status(500).json({ error: 'Failed to fetch intakes' });
  }
});

app.post('/api/intakes', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    const intakeData = {
      ...req.body,
      user_id: req.user.id,
    };

    const { data, error } = await userSupabase
      .from('intakes')
      .insert([intakeData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating intake:', error);
    res.status(500).json({ error: 'Failed to create intake' });
  }
});

app.put('/api/intakes/:id', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    const { data, error } = await userSupabase
      .from('intakes')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating intake:', error);
    res.status(500).json({ error: 'Failed to update intake' });
  }
});

// Generate daily intakes for a user
app.post('/api/intakes/generate-daily', authenticateUser, async (req, res) => {
  try {
    // Create a user-specific Supabase client with the user's JWT token
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${req.userToken}`,
        },
      },
    });

    const { date } = req.body; // Optional: generate for specific date, default to today
    const targetDate = date ? new Date(date) : new Date();

    // Get user's timing settings
    const { data: timingSettings, error: timingError } = await userSupabase
      .from('user_timing_settings')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (timingError && timingError.code !== 'PGRST116') throw timingError;

    // Default times if no settings exist
    const defaultTimes = {
      morning_time: '08:00:00',
      afternoon_time: '14:00:00',
      night_time: '20:00:00'
    };

    const times = timingSettings || defaultTimes;

    // Get user's medicines
    const { data: medicines, error: medError } = await userSupabase
      .from('medicines')
      .select('*')
      .eq('user_id', req.user.id);

    if (medError) throw medError;

    // Generate intakes for each medicine
    const intakesToCreate = [];

    for (const medicine of medicines) {
      // Morning intake
      if (medicine.morning_qty > 0) {
        intakesToCreate.push({
          user_id: req.user.id,
          medicine_id: medicine.id,
          scheduled_time: `${targetDate.toISOString().split('T')[0]}T${times.morning_time}`,
          status: 'scheduled',
          quantity: medicine.morning_qty
        });
      }

      // Afternoon intake
      if (medicine.afternoon_qty > 0) {
        intakesToCreate.push({
          user_id: req.user.id,
          medicine_id: medicine.id,
          scheduled_time: `${targetDate.toISOString().split('T')[0]}T${times.afternoon_time}`,
          status: 'scheduled',
          quantity: medicine.afternoon_qty
        });
      }

      // Night intake
      if (medicine.night_qty > 0) {
        intakesToCreate.push({
          user_id: req.user.id,
          medicine_id: medicine.id,
          scheduled_time: `${targetDate.toISOString().split('T')[0]}T${times.night_time}`,
          status: 'scheduled',
          quantity: medicine.night_qty
        });
      }
    }

    if (intakesToCreate.length > 0) {
      const { data, error } = await userSupabase
        .from('intakes')
        .insert(intakesToCreate)
        .select();

      if (error) throw error;
      res.json({ message: `Generated ${data.length} intakes for ${targetDate.toDateString()}` });
    } else {
      res.json({ message: 'No intakes to generate' });
    }
  } catch (error) {
    console.error('Error generating daily intakes:', error);
    res.status(500).json({ error: 'Failed to generate daily intakes' });
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('Connected to Supabase database');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});