CREATE TABLE eventos_pastorais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo VARCHAR NOT NULL CHECK (tipo IN ('culto', 'visita', 'conversao', 'agenda')),
    titulo VARCHAR NOT NULL,
    descricao TEXT,
    data_evento TIMESTAMPTZ NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'realizado', 'cancelado')),
    pessoa_envolvida VARCHAR,
    local VARCHAR,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Políticas de segurança
ALTER TABLE eventos_pastorais ENABLE ROW LEVEL SECURITY;

-- Política para leitura/escrita apenas para pastor
CREATE POLICY "Controle total para pastor" ON eventos_pastorais
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'pastor'
        )
    );
