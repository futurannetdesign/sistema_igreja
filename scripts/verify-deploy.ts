import { supabase } from "../lib/supabase";

export async function verifyDeploy(): Promise<void> {
  try {
    // Verifica conexão com Supabase
    const { error } = await supabase.from("user_roles").select("count");
    if (error) throw error;

    // Verifica variáveis de ambiente
    const requiredEnvVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];

    const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing environment variables: ${missingEnvVars.join(", ")}`
      );
    }

    console.log("✅ Deploy verification passed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Deploy verification failed:", error);
    process.exit(1);
  }
}

// Only run if this is the main module
if (require.main === module) {
  verifyDeploy();
}
