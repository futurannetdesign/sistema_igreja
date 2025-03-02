-- Limpar roles existentes
TRUNCATE TABLE user_roles;

-- Inserir roles para cada usuário
INSERT INTO user_roles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@igreja.com';

INSERT INTO user_roles (id, role)
SELECT id, 'pastor'
FROM auth.users
WHERE email = 'pastor@igreja.com';

INSERT INTO user_roles (id, role)
SELECT id, 'secretary'
FROM auth.users
WHERE email = 'secretaria@igreja.com';

-- Verificar se os roles foram inseridos
SELECT 
  au.email,
  ur.role
FROM auth.users au
JOIN user_roles ur ON au.id = ur.id;
