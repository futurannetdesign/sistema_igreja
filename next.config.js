// Clean environment variables to remove extraneous quotes, \r and \n
process.env.NEXT_PUBLIC_SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || ""
)
  .replace(/["\r\n]/g, "")
  .trim();
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)
  .replace(/["\r\n]/g, "")
  .trim();
process.env.SUPABASE_SERVICE_ROLE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)
  .replace(/["\r\n]/g, "")
  .trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/sistema-igreja" : "",
  images: {
    unoptimized: true,
    domains: ["qkxifbkphhdywoscmmyh.supabase.co"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  cleanDistDir: true,
  optimizeFonts: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  // This ensures environment variables are available during build
  serverRuntimeConfig: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Comment out or remove dynamic features
  // headers: async () => [...],
  // rewrites: async () => [...],
  // redirects: async () => [...],
  trailingSlash: true,
};

module.exports = nextConfig;
