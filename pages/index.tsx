import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import type { RoleType } from "../types/auth";

export default function Home(): JSX.Element {
  const router = useRouter();

  const handleRedirect = useCallback(
    async (role: RoleType): Promise<void> => {
      await router.push(`/admin/dashboard/${role}`);
    },
    [router]
  );

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          void router.push("/login");
          return;
        }

        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleData?.role) {
          await handleRedirect(roleData.role as RoleType);
        } else {
          void router.push("/login");
        }
      } catch (error) {
        console.error("Erro:", error);
        void router.push("/login");
      }
    };

    void checkAuth();
  }, [handleRedirect, router]);

  return <div>Redirecionando...</div>;
}
