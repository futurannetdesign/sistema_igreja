-- Adicionar índice único para evitar duplicatas
ALTER TABLE membros 
ADD CONSTRAINT unique_membro 
UNIQUE (nome, data_nascimento);

-- Criar função para verificar duplicatas
CREATE OR REPLACE FUNCTION check_duplicate_membro()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM membros 
    WHERE nome = NEW.nome 
    AND data_nascimento = NEW.data_nascimento
    AND id != COALESCE(NEW.id, -1)
  ) THEN
    RAISE EXCEPTION 'Membro já cadastrado com mesmo nome e data de nascimento';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para validação
CREATE TRIGGER check_duplicate_membro
BEFORE INSERT OR UPDATE ON membros
FOR EACH ROW
EXECUTE FUNCTION check_duplicate_membro();
