import { execSync } from "child_process";

async function verifyVercelEnv(): Promise<void> {
  try {
    console.log("🔍 Verificando variáveis na Vercel...");

    const output = execSync("vercel env ls", { encoding: "utf8" });

    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];

    const missingVars = requiredVars.filter((v) => !output.includes(v));

    if (missingVars.length > 0) {
      throw new Error(
        `Variáveis faltando na Vercel: ${missingVars.join(", ")}`
      );
    }

    console.log("✅ Todas as variáveis configuradas na Vercel!");
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

verifyVercelEnv();
