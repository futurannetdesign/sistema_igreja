-- Criar políticas para visitantes (somente leitura)
CREATE POLICY "Permitir leitura para visitantes"
ON membros FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'visitor'
    )
);

-- Atualizar função de verificação de roles
CREATE OR REPLACE FUNCTION check_user_role(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND (
      role = required_role 
      OR role = 'admin' 
      OR (required_role = 'visitor' AND role IN ('visitor', 'secretary', 'pastor', 'admin'))
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
