vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Quando for solicitado, selecione o secret "next_public_supabase_url".
vercel secrets add next_public_supabase_url "https://qkxifbkphhdywoscmmyh.supabase.co"
vercel secrets ls






# Quando solicitado, selecione o secret "next_public_supabase_anon_key".vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY productionvercel secrets add next_public_supabase_anon_key "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTg1OTEsImV4cCI6MjA1MzAzNDU5MX0.44s3Au1gh-vQVxlFQfFfDDEDSIkdkbtYxzX3tyZnw2I"# Por fim, limpe o cache e tente o deploy novamente:
rm -rf .next
npm run deploy:final
