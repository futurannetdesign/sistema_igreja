import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { pingHealthCheck } from "../utils/healthCheck";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createClientComponentClient());

  useEffect(() => {
    // Ping a cada 5 minutos
    const interval = setInterval(pingHealthCheck, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Debug para verificar caminhos das imagens
    console.log("Verificando caminhos das imagens:");
    const images = [
      "/images/logo.png",
      "/images/favicon.ico",
      "/images/favicon-32x32.png",
      "/images/favicon-16x16.png",
      "/images/apple-touch-icon.png",
    ];

    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      img.onload = () => console.log(`✅ Imagem carregada: ${path}`);
      img.onerror = () => console.error(`❌ Erro ao carregar: ${path}`);
    });
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <title>Sistema Igreja</title>
      </Head>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
