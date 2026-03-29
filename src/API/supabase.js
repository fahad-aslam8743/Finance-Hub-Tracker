import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient('https://igpwnyondrqobewlmtvt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncHdueW9uZHJxb2Jld2xtdHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDI2NjMsImV4cCI6MjA4ODMxODY2M30.0Idy4XXKEvRgTjTGSkralr0LlnLJhFOxkGdw2R0hYHw');