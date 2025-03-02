import { execSync } from "child_process";

async function deployWithEnv(): Promise<void> {
  try {
    console.log("🚀 Iniciando deploy com variáveis de ambiente...");

    // Primeiro, garantir que o projeto está linkado
    console.log("1. Verificando link com o projeto...");
    try {
      execSync("vercel link --yes", { stdio: "inherit" });
    } catch (error) {
      if (error instanceof Error) {
        console.log("Projeto já está linkado, continuando...", error.message);
      }
    }

    // Configurar as variáveis direto no deploy
    console.log("2. Iniciando deploy com variáveis de ambiente...");
    const deployCommand = [
      "vercel",
      "deploy",
      "--prod",
      "--yes",
      "-e",
      "NEXT_PUBLIC_SUPABASE_URL=https://qkxifbkphhdywoscmmyh.supabase.co",
      "-e",
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTg1OTEsImV4cCI6MjA1MzAzNDU5MX0.44s3Au1gh-vQVxlFQfFfDDEDSIkdkbtYxzX3tyZnw2I`,
      "-e",
      `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQ1ODU5MSwiZXhwIjoyMDUzMDM0NTkxfQ.EFPSk1mA7V1xBVPkHK532elLQDPa_wSSJIVs_xN2AdI`,
      "--force",
    ].join(" ");

    execSync(deployCommand, { stdio: "inherit" });
    console.log("✅ Deploy realizado com sucesso!");
  } catch (error) {
    console.error("\n❌ Erro no deploy:", error);
    process.exit(1);
  }
}

deployWithEnv().catch(console.error);
