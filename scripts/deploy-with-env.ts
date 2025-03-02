import { execSync } from "child_process";
import * as fs from "fs";

async function deployWithEnv(): Promise<void> {
  try {
    console.log("🚀 Iniciando deploy...");

    // 1. Limpar cache e preparar ambiente
    console.log("1. Limpando cache...");
    execSync("rm -rf .next", { stdio: "inherit" });
    execSync("rm -rf .vercel", { stdio: "inherit" });

    // 2. Build local para verificar se está tudo ok
    console.log("2. Testando build local...");
    execSync("next build", { stdio: "inherit" });

    // 3. Criar arquivo vercel.json com configurações
    console.log("3. Configurando projeto...");
    const vercelConfig = {
      version: 2,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: "https://qkxifbkphhdywoscmmyh.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTg1OTEsImV4cCI6MjA1MzAzNDU5MX0.44s3Au1gh-vQVxlFQfFfDDEDSIkdkbtYxzX3tyZnw2I",
        SUPABASE_SERVICE_ROLE_KEY:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQ1ODU5MSwiZXhwIjoyMDUzMDM0NTkxfQ.EFPSk1mA7V1xBVPkHK532elLQDPa_wSSJIVs_xN2AdI",
      },
      build: {
        env: {
          NEXT_PUBLIC_SUPABASE_URL: "https://qkxifbkphhdywoscmmyh.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTg1OTEsImV4cCI6MjA1MzAzNDU5MX0.44s3Au1gh-vQVxlFQfFfDDEDSIkdkbtYxzX3tyZnw2I",
          SUPABASE_SERVICE_ROLE_KEY:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQ1ODU5MSwiZXhwIjoyMDUzMDM0NTkxfQ.EFPSk1mA7V1xBVPkHK532elLQDPa_wSSJIVs_xN2AdI",
        },
      },
    };

    // Escrever configuração no arquivo vercel.json
    fs.writeFileSync("vercel.json", JSON.stringify(vercelConfig, null, 2));

    // 4. Deploy para Vercel
    console.log("4. Fazendo deploy...");
    execSync("vercel deploy --prod --yes", { stdio: "inherit" });

    console.log("✅ Deploy realizado com sucesso!");
  } catch (error) {
    console.error("\n❌ Erro no deploy:", error);
    process.exit(1);
  }
}

deployWithEnv().catch(console.error);
