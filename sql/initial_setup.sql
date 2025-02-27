-- Criar tabela de roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'pastor', 'secretary'))
);

-- Habilitar autenticação por email
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (NEW.id, 'secretary'); -- papel padrão
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir usuários iniciais via Supabase Dashboard Authentication:
-- admin@igreja.com / Admin123
-- pastor@igreja.com / Pastor123
-- secretaria@igreja.com / Secretaria123
