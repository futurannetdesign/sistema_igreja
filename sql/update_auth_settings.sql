-- Desabilitar confirmação de email
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS email_confirmed_at TIMESTAMPTZ DEFAULT NOW();

-- Remover políticas antigas primeiro
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON auth.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON auth.users;

-- Atualizar configurações de autenticação
ALTER TABLE IF EXISTS auth.users
ALTER COLUMN email_confirmed_at SET DEFAULT now();

-- Atualizar usuários existentes
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Criar política para permitir atualizações usando auth.uid()
CREATE POLICY "Enable updates for service role" ON auth.users
    USING (true)
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Verificar configurações
SELECT email, email_confirmed_at, created_at 
FROM auth.users;

-- Temporariamente desabilitar RLS para garantir atualizações
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
