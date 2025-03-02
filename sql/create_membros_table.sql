-- Dropar a tabela se existir
DROP TABLE IF EXISTS membros;

-- Criar tabela membros com UUID em vez de BIGINT
CREATE TABLE membros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR NOT NULL,
    email VARCHAR,
    telefone VARCHAR,
    data_nascimento DATE NOT NULL,
    endereco TEXT,
    data_batismo DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir select para todos usuários autenticados
CREATE POLICY "Permitir select para usuários autenticados"
ON membros FOR SELECT
TO authenticated
USING (true);

-- Criar política para permitir insert/update/delete apenas para admin
CREATE POLICY "Permitir insert/update/delete para admin"
ON membros FOR ALL
TO authenticated
USING (
    auth.uid()::text IN (
        SELECT id::text FROM user_roles WHERE role = 'admin'
    )
);
