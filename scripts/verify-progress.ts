import { execSync } from "child_process";

async function checkDeployProgress(): Promise<void> {
  console.log("\n🔍 Verificando configurações...\n");

  try {
    // Verificar variáveis de ambiente
    const envs = execSync("vercel env ls", { encoding: "utf8" });
    console.log("Variáveis configuradas:");
    console.log(envs);

    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];

    const missingVars = requiredVars.filter((v) => !envs.includes(v));

    if (missingVars.length > 0) {
      console.log("\n❌ Faltam configurar:", missingVars.join(", "));
    } else {
      console.log("\n✅ Todas as variáveis configuradas!");
    }
  } catch (error) {
    console.error("\n❌ Erro ao verificar configurações:", error);
  }
}

checkDeployProgress();
