import { supabase } from "../lib/supabase";

export async function checkSupabaseConnection(): Promise<void> {
  try {
    const { error } = await supabase.from("user_roles").select("count");
    if (error) throw error;
    console.log("✅ Supabase connection successful");
  } catch (error) {
    console.error("❌ Supabase connection failed");
    throw error;
  }
}

export async function checkBackupConfiguration(): Promise<void> {
  try {
    // Verify backup settings exist
    const { data: settings, error } = await supabase
      .from("backup_settings")
      .select("*")
      .single();

    if (error) throw error;
    if (!settings) throw new Error("Backup settings not configured");

    console.log("✅ Backup configuration verified");
  } catch (error) {
    console.error("❌ Backup configuration check failed");
    throw error;
  }
}
