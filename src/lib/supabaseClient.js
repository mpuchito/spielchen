import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jrjlvwrafuymmqwozrhn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyamx2d3JhZnV5bW1xd296cmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTU3MzcsImV4cCI6MjA3MTg5MTczN30.Qh6Cgh0X55ufCNme3QnEdZdvTCTdb8YGer4yxZLUGNo";

// exportamos la instancia para reutilizarla en toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
