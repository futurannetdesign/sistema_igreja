-- Verificar e corrigir a tabela eventos
ALTER TABLE IF EXISTS eventos
ALTER COLUMN data_inicio TYPE timestamptz,
ALTER COLUMN data_fim TYPE timestamptz,
ALTER COLUMN created_at SET DEFAULT NOW(),
ALTER COLUMN created_at SET NOT NULL;

-- Verificar políticas
DROP POLICY IF EXISTS "Permitir gestão para admin e pastor" ON eventos;
CREATE POLICY "Permitir gestão para admin e pastor"
ON eventos FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'pastor', 'secretary')
    )
);
