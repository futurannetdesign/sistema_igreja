import { execSync } from "child_process";

async function finalDeploy(): Promise<void> {
  try {
    console.log("\n🚀 Iniciando processo de deploy...\n");

    // Verificar build local
    console.log("1. Testando build...");
    execSync("npm run build", { stdio: "inherit" });

    // Fazer deploy
    console.log("\n2. Iniciando deploy para produção...");
    execSync("vercel --prod", { stdio: "inherit" });

    console.log("\n✅ Deploy concluído com sucesso!");
  } catch (error) {
    console.error("\n❌ Erro no deploy:", error);
    process.exit(1);
  }
}

finalDeploy();
