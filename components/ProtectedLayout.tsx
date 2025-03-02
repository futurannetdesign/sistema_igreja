import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkUserRole } from "../utils/auth";

interface ProtectedProps {
  allowedRoles: string[];
}

export const ProtectedLayout = <P extends object>(
  Component: React.ComponentType<P>,
  options: ProtectedProps
) => {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const userRole = await checkUserRole();

        if (!userRole || !options.allowedRoles.includes(userRole)) {
          router.push("/login");
          return;
        }

        setIsAuthorized(true);
      };

      checkAuth();
    }, [router]);

    if (!isAuthorized) {
      return <div>Carregando...</div>;
    }

    return <Component {...props} />;
  };
};
