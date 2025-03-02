import { checkEnvironment } from "./check-env";
import { verifyDeploy } from "./verify-deploy";
import {
  checkSupabaseConnection,
  checkBackupConfiguration,
} from "./supabase-checks";
import { checkSecurity } from "./security-check";

async function runPreDeploymentChecks(): Promise<void> {
  const checks = [
    { name: "Ambiente", fn: checkEnvironment },
    { name: "Deploy", fn: verifyDeploy },
    { name: "Conexão Supabase", fn: checkSupabaseConnection },
    { name: "Backup", fn: checkBackupConfiguration },
    { name: "Segurança", fn: checkSecurity },
  ];

  console.log("🔍 Iniciando verificações pré-deploy...\n");

  for (const check of checks) {
    try {
      console.log(`⏳ Verificando ${check.name}...`);
      await check.fn();
      console.log(`✅ ${check.name} OK\n`);
    } catch (error) {
      console.error(`❌ Falha na verificação de ${check.name}:`, error);
      process.exit(1);
    }
  }

  console.log("✅ Sistema pronto para deploy!");
}

// Executar se for o módulo principal
if (require.main === module) {
  runPreDeploymentChecks();
}
