-- 1. Limpar tudo primeiro
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Criar estrutura da tabela
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'pastor', 'secretary')),
  CONSTRAINT fk_user
    FOREIGN KEY (id)
    REFERENCES auth.users (id)
);

-- 3. Criar função para novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (NEW.id, 'secretary');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Inserir todos os roles
INSERT INTO user_roles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@igreja.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (id, role)
SELECT id, 'pastor'
FROM auth.users
WHERE email = 'pastor@igreja.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (id, role)
SELECT id, 'secretary'
FROM auth.users
WHERE email = 'secretaria@igreja.com'
ON CONFLICT (id) DO NOTHING;

-- 6. Verificar configuração final
SELECT 
  au.email,
  au.id,
  ur.role
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.id
ORDER BY ur.role;
