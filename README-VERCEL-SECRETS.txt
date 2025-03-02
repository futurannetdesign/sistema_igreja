rm -rf .next
npm run deploy:final
# Configure a variável de ambiente NEXT_PUBLIC_SUPABASE_URL em produção:
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Quando solicitado, escolha o secret "next_public_supabase_url"

# Configure a variável de ambiente NEXT_PUBLIC_SUPABASE_ANON_KEY em produção:
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Quando solicitado, escolha o secret "next_public_supabase_anon_key"
# Adiciona o secret para a URL do Supabase:
vercel secrets add next_public_supabase_url "https://qkxifbkphhdywoscmmyh.supabase.co"

# Adiciona o secret para a chave anônima do Supabase:
vercel secrets add next_public_supabase_anon_key "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTg1OTEsImV4cCI6MjA1MzAzNDU5MX0.44s3Au1gh-vQVxlFQfFfDDEDSIkdkbtYxzX3tyZnw2I"
