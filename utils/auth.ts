import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const checkUserRole = async () => {
  const supabase = createClientComponentClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Atualizado para usar user_id em vez de id
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id) // Aqui está a mudança principal
      .single();

    return roleData?.role || null;
  } catch (error) {
    console.error("Erro ao verificar papel do usuário:", error);
    return null;
  }
};

export const signOut = async () => {
  const supabase = createClientComponentClient();
  try {
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return false;
  }
};
