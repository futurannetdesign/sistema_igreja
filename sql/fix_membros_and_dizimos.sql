-- Criar tabela temporária para backup dos dízimos
CREATE TABLE temp_dizimos AS SELECT * FROM dizimos;

-- Criar tabela temporária para backup dos membros
CREATE TABLE temp_membros AS SELECT * FROM membros;

-- Remover constraints existentes
ALTER TABLE dizimos DROP CONSTRAINT IF EXISTS dizimos_membro_id_fkey;

-- Recriar a tabela membros
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

-- Restaurar dados dos membros
INSERT INTO membros 
SELECT * FROM temp_membros;

-- Recriar a tabela dízimos
DROP TABLE IF EXISTS dizimos CASCADE;
CREATE TABLE dizimos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    membro_id UUID NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATE NOT NULL,
    tipo VARCHAR NOT NULL CHECK (tipo IN ('dizimo', 'oferta')),
    observacao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Restaurar dados dos dízimos
INSERT INTO dizimos 
SELECT * FROM temp_dizimos;

-- Adicionar constraint de chave estrangeira
ALTER TABLE dizimos
ADD CONSTRAINT dizimos_membro_id_fkey 
FOREIGN KEY (membro_id) 
REFERENCES membros(id) 
ON DELETE CASCADE;

-- Remover tabelas temporárias
DROP TABLE temp_dizimos;
DROP TABLE temp_membros;

-- Recriar índices e políticas
CREATE INDEX idx_membros_nome ON membros(nome);
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE dizimos ENABLE ROW LEVEL SECURITY;

-- Políticas para membros
CREATE POLICY "Permitir leitura para usuários autenticados" ON membros
    FOR SELECT USING (auth.role() IN ('authenticated'));

CREATE POLICY "Permitir escrita para roles autorizados" ON membros
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'secretary', 'pastor')
        )
    );

-- Políticas para dízimos
CREATE POLICY "Permitir leitura para usuários autenticados" ON dizimos
    FOR SELECT USING (auth.role() IN ('authenticated'));

CREATE POLICY "Permitir escrita para roles autorizados" ON dizimos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'secretary')
        )
    );
