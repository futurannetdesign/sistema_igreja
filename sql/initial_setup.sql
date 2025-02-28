-- Primeiro, dropar a tabela existente se necessário
DROP TABLE IF EXISTS user_roles;

-- Criar tabela de roles com a estrutura correta
CREATE TABLE user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'pastor', 'secretary'))
);

-- Atualizar a função trigger para usar o nome correto da coluna (id em vez de user_id)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (NEW.id, 'secretary');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir roles usando o nome correto da coluna (id em vez de user_id)
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
