import { createClient } from "@supabase/supabase-js";

// Função de limpeza melhorada: remove aspas, \r e \n
function cleanEnv(value: string | undefined): string {
  if (!value) {
    throw new Error("Valor inválido de variável de ambiente");
  }
  return value.replace(/["\r\n]/g, "").trim();
}

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
