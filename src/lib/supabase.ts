
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://imaaeinckshmddmhhcla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltYWFlaW5ja3NobWRkbWhoY2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NTMxODMsImV4cCI6MjA1ODEyOTE4M30.ey0Qnt0KiCjU4gnTYq4CasnRJDZQfsl2zrJpwHMUjB8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
