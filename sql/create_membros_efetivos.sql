CREATE TABLE membros_efetivos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR NOT NULL,
    email VARCHAR,
    telefone VARCHAR,
    data_batismo DATE,
    cargo_ministerial VARCHAR,
    data_membro DATE NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Criar índices
CREATE INDEX idx_membros_efetivos_nome ON membros_efetivos(nome);
CREATE INDEX idx_membros_efetivos_status ON membros_efetivos(status);

-- Políticas de segurança
ALTER TABLE membros_efetivos ENABLE ROW LEVEL SECURITY;

-- Política para leitura
CREATE POLICY "Permitir leitura para usuários autenticados" ON membros_efetivos
    FOR SELECT USING (auth.role() IN ('authenticated'));

-- Política para escrita
CREATE POLICY "Permitir escrita para roles autorizados" ON membros_efetivos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'secretary', 'pastor')
        )
    );
