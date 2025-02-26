
-- Tabela de usuários (para autenticação)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- senha criptografada
  role VARCHAR(50) NOT NULL,       -- ex.: admin, secretary, pastor
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de membros
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birthDate DATE NOT NULL,
  baptismDate DATE,
  phone VARCHAR(50) NOT NULL,
  photo TEXT DEFAULT '../../assets/avatar-placeholder.png',
  registrationDate DATE DEFAULT CURRENT_DATE
);
