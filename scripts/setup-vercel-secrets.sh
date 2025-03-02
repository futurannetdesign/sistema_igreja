#!/bin/bash
# This script configures the Vercel secrets and associates them with environment variables.

echo "Adding secrets to Vercel..."
vercel secrets add next_public_supabase_url "https://qkxifbkphhdywoscmmyh.supabase.co"
vercel secrets add next_public_supabase_anon_key "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreGlmYmtwaGhkeXdvc2NtbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTg1OTEsImV4cCI6MjA1MzAzNDU5MX0.44s3Au1gh-vQVxlFQfFfDDEDSIkdkbtYxzX3tyZnw2I"

echo "Configuring production environment variables..."
echo "Setting NEXT_PUBLIC_SUPABASE_URL (choose secret: next_public_supabase_url)"
vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "Setting NEXT_PUBLIC_SUPABASE_ANON_KEY (choose secret: next_public_supabase_anon_key)"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "Vercel secrets configuration complete!"
