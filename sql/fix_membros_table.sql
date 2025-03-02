-- Desabilitar verificação de chaves estrangeiras temporariamente
ALTER TABLE dizimos DROP CONSTRAINT IF EXISTS dizimos_membro_id_fkey;

-- Recriar a tabela membros com tipos corretos
DROP TABLE IF EXISTS membros CASCADE;

CREATE TABLE membros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR NOT NULL,
    email VARCHAR,
    telefone VARCHAR,
    data_nascimento DATE NOT NULL,
    endereco TEXT,
    data_batismo DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Recriar a chave estrangeira na tabela dizimos
ALTER TABLE dizimos
ADD CONSTRAINT dizimos_membro_id_fkey 
FOREIGN KEY (membro_id) 
REFERENCES membros(id) 
ON DELETE CASCADE;

-- Criar índice para busca por nome
CREATE INDEX idx_membros_nome ON membros(nome);

-- Políticas de segurança
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;

-- Política para leitura
CREATE POLICY "Permitir leitura para usuários autenticados" ON membros
    FOR SELECT USING (auth.role() IN ('authenticated'));

-- Política para escrita
CREATE POLICY "Permitir escrita para roles autorizados" ON membros
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'secretary', 'pastor')
        )
    );
