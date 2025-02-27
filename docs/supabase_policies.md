# Políticas de Segurança do Supabase

## Tabela: membros

```sql
-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Permitir select para usuários autenticados" ON "public"."membros"
FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir inserção apenas para admins
CREATE POLICY "Permitir insert para admins" ON "public"."membros"
FOR INSERT TO authenticated USING (auth.user_id IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
));

-- Permitir atualização apenas para admins
CREATE POLICY "Permitir update para admins" ON "public"."membros"
FOR UPDATE TO authenticated USING (auth.user_id IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
));
```

## Tabela: dizimos

```sql
-- Permitir leitura apenas para admins e tesoureiros
CREATE POLICY "Permitir select para admins e tesoureiros" ON "public"."dizimos"
FOR SELECT USING (auth.user_id IN (
  SELECT user_id FROM user_roles WHERE role IN ('admin', 'tesoureiro')
));

-- Permitir inserção apenas para admins e tesoureiros
CREATE POLICY "Permitir insert para admins e tesoureiros" ON "public"."dizimos"
FOR INSERT TO authenticated USING (auth.user_id IN (
  SELECT user_id FROM user_roles WHERE role IN ('admin', 'tesoureiro')
));
```

## Tabela: eventos

```sql
-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Permitir select para usuários autenticados" ON "public"."eventos"
FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir gerenciamento apenas para admins
CREATE POLICY "Permitir insert/update para admins" ON "public"."eventos"
FOR ALL TO authenticated USING (auth.user_id IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
));
```
