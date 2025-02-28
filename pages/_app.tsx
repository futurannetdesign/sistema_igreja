import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { pingHealthCheck } from "../utils/healthCheck";
import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createClientComponentClient());

  useEffect(() => {
    // Ping a cada 5 minutos
    const interval = setInterval(pingHealthCheck, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
