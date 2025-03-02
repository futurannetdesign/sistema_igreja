import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useUserRole() {
  const [role, setRole] = useState<"admin" | "secretary" | "pastor" | null>(
    null
  );

  useEffect(() => {
    async function fetchRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (userRole) {
          setRole(userRole.role as "admin" | "secretary" | "pastor");
        }
      }
    }

    fetchRole();
  }, []);

  return role;
}
