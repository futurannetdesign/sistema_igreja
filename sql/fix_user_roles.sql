-- Primeiro, dropa a tabela existente
DROP TABLE IF EXISTS user_roles;

-- Recria a tabela com a estrutura correta
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'pastor', 'secretary')),
  CONSTRAINT fk_user
    FOREIGN KEY (id)
    REFERENCES auth.users (id)
);

-- Insere os roles novamente
INSERT INTO user_roles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@igreja.com';

-- Verifica se foi inserido corretamente
SELECT 
  au.email,
  au.id,
  ur.role
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.id
WHERE au.email = 'admin@igreja.com';
