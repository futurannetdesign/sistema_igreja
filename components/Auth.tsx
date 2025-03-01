import { useEffect } from "react";
import type { ComponentType } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import type { RoleType } from "../types/auth";

interface AuthProps {
  [key: string]: unknown;
}

export const withAuth = (
  WrappedComponent: ComponentType<AuthProps>,
  allowedRoles: RoleType[]
): ComponentType<AuthProps> => {
  const AuthComponent = (props: AuthProps): JSX.Element => {
    const router = useRouter();

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

          const { data: userRole } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();

          const role = userRole?.role as RoleType;
          if (!role || !allowedRoles.includes(role)) {
            void router.push("/login");
          }
        } catch (error) {
          console.error("Erro de autenticação:", error);
          void router.push("/login");
        }
      };

      void checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  return AuthComponent;
};
