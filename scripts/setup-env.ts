import { execSync } from "child_process";

async function setupEnvironment(): Promise<void> {
  try {
    console.log("🔧 Configurando variáveis de ambiente...");

    // Remove existing environment variables if they exist
    try {
      execSync("vercel env rm NEXT_PUBLIC_SUPABASE_URL -y");
      execSync("vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY -y");
      execSync("vercel env rm SUPABASE_SERVICE_ROLE_KEY -y");
    } catch (e) {
      // Ignore errors if variables don't exist
    }

    // Add environment variables directly
    execSync(
      'vercel env add NEXT_PUBLIC_SUPABASE_URL="https://qkxifbkphhdywoscmmyh.supabase.co"'
    );
    execSync(
      'vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTg1OTEsImV4cCI6MjA1MzAzNDU5MX0.44s3Au1gh-vQVxlFQfFfDDEDSIkdkbtYxzX3tyZnw2I"'
    );
    execSync(
      'vercel env add SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQ1ODU5MSwiZXhwIjoyMDUzMDM0NTkxfQ.EFPSk1mA7V1xBVPkHK532elLQDPa_wSSJIVs_xN2AdI"'
    );

    console.log("✅ Variáveis de ambiente configuradas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao configurar variáveis:", error);
    process.exit(1);
  }
}

setupEnvironment().catch(console.error);
