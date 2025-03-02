import { execSync } from "child_process";
import { config } from "dotenv";

async function setupSecrets(): Promise<void> {
  console.log("🔒 Configurando variáveis de ambiente na Vercel...");

  try {
    const result = config({ path: ".env.local" });
    if (result.error) {
      throw new Error("Não foi possível carregar o arquivo .env.local");
    }

    // Verificar se as variáveis foram carregadas
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      throw new Error("Variáveis de ambiente não encontradas no .env.local");
    }

    // Apenas puxar as variáveis existentes
    console.log("Atualizando variáveis de ambiente...");
    execSync("vercel env pull --yes", { stdio: "inherit" });

    console.log("\n✅ Variáveis de ambiente configuradas!");
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
}

setupSecrets().catch(console.error);
