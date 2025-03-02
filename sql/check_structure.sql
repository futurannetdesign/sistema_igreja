-- Primeiro, limpar tudo
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recriar a tabela com user_id
CREATE TABLE user_roles (
  user_id UUID PRIMARY KEY,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'pastor', 'secretary')),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
);

-- Inserir os roles
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@igreja.com';

INSERT INTO user_roles (user_id, role)
SELECT id, 'pastor'
FROM auth.users
WHERE email = 'pastor@igreja.com';

INSERT INTO user_roles (user_id, role)
SELECT id, 'secretary'
FROM auth.users
WHERE email = 'secretaria@igreja.com';

-- Verificar se deu certo
SELECT 
  au.email,
  ur.user_id,
  ur.role
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id;
