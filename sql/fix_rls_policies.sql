-- Limpar políticas antigas
DROP POLICY IF EXISTS "Permitir select para usuários autenticados" ON membros;
DROP POLICY IF EXISTS "Permitir insert/update/delete para admin" ON membros;
DROP POLICY IF EXISTS "Permitir insert para admins" ON membros;
DROP POLICY IF EXISTS "Permitir update para admins" ON membros;
DROP POLICY IF EXISTS "Permitir delete para admins" ON membros;

-- Recriar políticas corretamente
CREATE POLICY "Permitir select para usuários autenticados"
ON membros FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir insert para admins"
ON membros FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "Permitir update para admins"
ON membros FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "Permitir delete para admins"
ON membros FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Verificar configuração
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'membros';
