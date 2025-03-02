import { supabase } from "../lib/supabase";

export async function checkSecurity(): Promise<void> {
  const checks = {
    env: {
      // Verifica se variáveis sensíveis não estão expostas
      envFilesSecure:
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes("eyJ"),
      envVarsSet:
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    auth: {
      // Verifica configurações de autenticação
      rolesConfigured: false,
      policiesSet: false,
    },
    database: {
      // Verifica configurações do banco
      backupConfigured: false,
      rLSEnabled: false,
    },
  };

  try {
    // Verifica roles
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .limit(1);

    checks.auth.rolesConfigured = !!roles;

    // Verifica RLS
    const { data: policies } = await supabase.rpc("check_rls_enabled");

    checks.database.rLSEnabled = !!policies;

    console.table(checks);

    // Se encontrar algum problema de segurança
    if (
      Object.values(checks).some((group) =>
        Object.values(group).some((check) => !check)
      )
    ) {
      throw new Error("❌ Falhas de segurança encontradas!");
    }

    console.log("✅ Verificação de segurança passou!");
  } catch (error) {
    console.error("Problemas de segurança encontrados:", error);
    process.exit(1);
  }
}

// Run if this is the main module
if (require.main === module) {
  checkSecurity()
    .then(() => console.log("Security check complete"))
    .catch((error) => {
      console.error("Security check failed:", error);
      process.exit(1);
    });
}
