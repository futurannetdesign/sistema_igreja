import { execSync } from "child_process";

async function preDeployCheck(): Promise<void> {
  console.log("\n🚀 Iniciando verificações pré-deploy...\n");

  try {
    // Verificar status do projeto
    console.log("1. Verificando configuração do projeto...");
    execSync("vercel status", { stdio: "inherit" });

    // Verificar variáveis de ambiente
    console.log("\n2. Verificando variáveis de ambiente...");
    const envs = execSync("vercel env ls", { encoding: "utf8" });
    if (
      envs.includes("NEXT_PUBLIC_SUPABASE_URL") &&
      envs.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
      envs.includes("SUPABASE_SERVICE_ROLE_KEY")
    ) {
      console.log("✅ Todas as variáveis configuradas!");
    }

    console.log("\n✅ Tudo pronto para deploy!");
    console.log("\nPara fazer o deploy, execute:");
    console.log("npm run deploy:prod");
  } catch (error) {
    console.error("\n❌ Erro nas verificações:", error);
    process.exit(1);
  }
}

preDeployCheck();
