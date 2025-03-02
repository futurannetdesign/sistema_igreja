async function verifySetup(): Promise<void> {
  console.log("🔍 Verificando variáveis de ambiente...\n");

  // Verificar variáveis antes de importar supabase
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente necessárias não encontradas: ${missing.join(", ")}`
    );
  }

  // Agora é seguro importar supabase
  const { supabase } = await import("../lib/supabase");

  // Verificar variáveis de ambiente
  const envVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  for (const envVar of envVars) {
    if (!process.env[envVar]) {
      throw new Error(`❌ Variável de ambiente ${envVar} não encontrada`);
    }
    console.log(`✅ ${envVar} configurada`);
  }

  // Verificar conexão com Supabase
  try {
    const { error } = await supabase.from("user_roles").select("count");
    if (error) throw error;
    console.log("✅ Conexão com Supabase OK");
  } catch (error) {
    console.error("❌ Erro ao conectar com Supabase:", error);
    throw error;
  }

  console.log("\n✅ Tudo pronto para deploy!");
}

verifySetup().catch(console.error);
