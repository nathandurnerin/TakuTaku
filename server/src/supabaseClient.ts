import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Charge le .env à la racine du dossier /server
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log(process.env.SUPABASE_URL)

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("✅ SUPABASE_URL =", supabaseUrl);
console.log("✅ SUPABASE_SERVICE_ROLE_KEY =", supabaseServiceRoleKey);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("❌ Supabase environment variables are missing");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabase;
