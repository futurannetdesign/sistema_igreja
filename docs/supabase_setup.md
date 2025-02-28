# Configuração do Supabase

## 1. Criar Projeto

1. Acesse https://supabase.com
2. Faça login/signup
3. Clique em "New Project"
4. Preencha:
   - Nome do projeto
   - Senha do banco (guarde-a)
   - Região (escolha a mais próxima)

## 2. Configurar Autenticação

1. No menu lateral, vá para "Authentication" > "Providers"
2. Habilite "Email" provider
3. Configure as opções:
   - Disable email confirmations
   - Allow signup (se quiser permitir novos registros)

## 3. Criar Usuários

1. Vá para "Authentication" > "Users"
2. Clique em "Add User"
3. Crie os seguintes usuários:

### Administrador

- Email: admin@igreja.com
- Password: Admin123
- Role: admin

### Pastor

- Email: pastor@igreja.com
- Password: Pastor123
- Role: pastor

### Secretaria

- Email: secretaria@igreja.com
- Password: Secretaria123
- Role: secretary

## 4. Configurar Banco de Dados

1. Vá para "SQL Editor"
2. Execute o script de setup (encontrado em /sql/initial_setup.sql)

## 5. Copiar Credenciais

1. Vá para "Project Settings" > "API"
2. Copie:
   - Project URL
   - anon public key
3. Cole no arquivo .env.local:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_projeto
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica
   ```

## 6. Testar

1. Tente fazer login com as credenciais criadas
2. Verifique se os redirecionamentos funcionam conforme o papel do usuário
