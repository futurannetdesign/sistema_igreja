import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkUserRole } from "../utils/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedLayout({
  children,
  allowedRoles,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const userRole = await checkUserRole();

      if (!userRole || !allowedRoles.includes(userRole)) {
        router.push("/login");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
}
