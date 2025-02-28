-- Recriar a tabela eventos do zero
DROP TABLE IF EXISTS eventos;

CREATE TABLE eventos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMPTZ NOT NULL,
    data_fim TIMESTAMPTZ NOT NULL,
    local VARCHAR NOT NULL,
    tipo VARCHAR NOT NULL CHECK (tipo IN ('culto', 'reuniao', 'especial')),
    status VARCHAR NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
    responsavel_id UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir leitura para todos autenticados" ON eventos;
DROP POLICY IF EXISTS "Permitir gestão para admin e pastor" ON eventos;

-- Habilitar RLS
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Criar nova política de leitura
CREATE POLICY "Permitir leitura para autenticados"
ON eventos FOR SELECT
TO authenticated
USING (true);

-- Criar nova política de escrita
CREATE POLICY "Permitir escrita para roles autorizados"
ON eventos FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'pastor', 'secretary')
    )
);
