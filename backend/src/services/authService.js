const { createSupabaseClient } = require('../utils/supabaseClient');

const authService = {
  signUp: async ({ email, password, full_name }) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || email.split('@')[0],
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { user: data.user, session: data.session };
  },

  signIn: async ({ email, password }) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { user: data.user, session: data.session };
  },

  signOut: async () => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },

  getProfile: async (userId) => {
    const supabase = createSupabaseClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const supabaseService = createSupabaseClient(undefined, { useServiceRole: true });
    const { data: user, error: userError } = await supabaseService.auth.admin.getUserById(userId);

    if (userError) {
      throw new Error(userError.message);
    }

    return { user: user.user, profile };
  },

  startGoogleSignIn: async ({ req }) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${req.protocol}://${req.get('host')}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};

module.exports = {
  authService,
};
