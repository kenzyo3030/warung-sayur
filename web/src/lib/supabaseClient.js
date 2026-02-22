import { createClient } from '@supabase/supabase-js';

// Verified Supabase Credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://miqognrgvquvrdapseqj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcW9nbnJndnF1dnJkYXBzZXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk2MzcsImV4cCI6MjA4NzE3NTYzN30.ypwAKpOM0oY8qqdnl0lH-Qx0vrufNF4Wwvj_i6OmCTM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple connection test function (can be called to verify connection)
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) throw error;
    console.log('Supabase connection successful:', data);
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err.message);
    return false;
  }
};