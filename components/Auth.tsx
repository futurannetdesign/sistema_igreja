import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

interface AuthProps {
  [key: string]: any;
}

export const withAuth = (
  WrappedComponent: React.ComponentType<AuthProps>,
  allowedRoles: string[]
) => {
  return function AuthComponent(props: AuthProps) {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            router.push("/login");
            return;
          }

          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();

          if (!roles || !allowedRoles.includes(roles.role)) {
            router.push("/login");
          }
        } catch (error) {
          console.error("Erro de autenticação:", error);
          router.push("/login");
        }
      };

      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};
