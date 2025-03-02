import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

async function initEnv(): Promise<void> {
  try {
    console.log("🔧 Inicializando arquivo .env.local...");

    const envPath = path.resolve(process.cwd(), ".env.local");
    const examplePath = path.resolve(process.cwd(), ".env.example");

    // Verificar se .env.example existe
    if (!fs.existsSync(examplePath)) {
      throw new Error(".env.example não encontrado!");
    }

    // Fazer backup do .env.local existente se necessário
    if (fs.existsSync(envPath)) {
      fs.renameSync(envPath, `${envPath}.backup`);
      console.log("✓ Backup do .env.local criado");
    }

    // Copiar conteúdo do .env.example
    const exampleContent = fs.readFileSync(examplePath, "utf8");
    fs.writeFileSync(envPath, exampleContent);

    // Puxar variáveis do Vercel se disponíveis
    try {
      execSync("vercel env pull", { stdio: "inherit" });
    } catch (error) {
      console.log(
        "⚠️ Não foi possível puxar variáveis do Vercel (normal se ainda não configurado)"
      );
    }

    console.log("\n✅ Arquivo .env.local inicializado!");
    console.log("\nPor favor, edite o arquivo .env.local com suas variáveis:");
    console.log("1. NEXT_PUBLIC_SUPABASE_URL");
    console.log("2. NEXT_PUBLIC_SUPABASE_ANON_KEY");
    console.log("3. SUPABASE_SERVICE_ROLE_KEY");
  } catch (error) {
    console.error(
      "❌ Erro:",
      error instanceof Error ? error.message : "Erro desconhecido"
    );
    process.exit(1);
  }
}

initEnv().catch(console.error);
