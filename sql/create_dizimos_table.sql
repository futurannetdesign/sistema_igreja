DROP TABLE IF EXISTS dizimos;

CREATE TABLE dizimos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    membro_id UUID NOT NULL REFERENCES membros(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
    data DATE NOT NULL,
    tipo VARCHAR NOT NULL CHECK (tipo IN ('dizimo', 'oferta')),
    observacao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Políticas de segurança
ALTER TABLE dizimos ENABLE ROW LEVEL SECURITY;

-- Política para leitura
CREATE POLICY "Permitir leitura para usuários autenticados" ON dizimos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'secretary')
        )
    );

-- Política para inserção
CREATE POLICY "Permitir inserção para admin e secretary" ON dizimos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'secretary')
        )
    );

-- Política para atualização
CREATE POLICY "Permitir atualização para admin e secretary" ON dizimos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'secretary')
        )
    );

-- Política para exclusão
CREATE POLICY "Permitir exclusão para admin e secretary" ON dizimos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'secretary')
        )
    );
