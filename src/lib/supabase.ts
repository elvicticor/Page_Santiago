import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase no está configurado. Revisa PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key',
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
