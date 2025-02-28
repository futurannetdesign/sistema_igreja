CREATE TABLE eventos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    local VARCHAR,
    tipo VARCHAR NOT NULL CHECK (tipo IN ('culto', 'reuniao', 'especial')),
    responsavel_id UUID REFERENCES auth.users(id),
    status VARCHAR NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Políticas de segurança
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Política para leitura
CREATE POLICY "Permitir leitura para todos autenticados" ON eventos
    FOR SELECT USING (auth.role() IN ('authenticated'));

-- Política para criação/edição/exclusão
CREATE POLICY "Permitir gestão para admin e pastor" ON eventos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'pastor')
        )
    );
