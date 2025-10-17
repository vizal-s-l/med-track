const { createClient } = require('@supabase/supabase-js');

const createSupabaseClient = (accessToken, { useServiceRole = false } = {}) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase environment variables are not set');
  }

  const supabaseKey = useServiceRole ? serviceRoleKey : anonKey;

  if (useServiceRole && !serviceRoleKey) {
    throw new Error('Supabase service role key is required for this operation');
  }

  const options = accessToken
    ? {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    : undefined;

  return createClient(supabaseUrl, supabaseKey, options);
};

module.exports = {
  createSupabaseClient,
};
