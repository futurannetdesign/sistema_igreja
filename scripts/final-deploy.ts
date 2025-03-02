import { execSync } from "child_process";

async function finalDeploy(): Promise<void> {
  try {
    console.log("🚀 Iniciando processo de deploy...");

    // Deploy com variáveis de ambiente inline
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
    ].join(" ");

    execSync(deployCommand, { stdio: "inherit" });
    console.log("✅ Deploy realizado com sucesso!");
  } catch (error) {
    console.error("\n❌ Erro no deploy:", error);
    process.exit(1);
  }
}

finalDeploy().catch(console.error);
