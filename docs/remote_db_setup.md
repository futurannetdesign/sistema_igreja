# Configurando um Banco de Dados Remoto

1. **Escolha um provedor de banco de dados:**  
   Exemplo: [Heroku Postgres](https://www.heroku.com/postgres), [Supabase](https://supabase.io/) ou [Amazon RDS](https://aws.amazon.com/rds/).

2. **Crie uma conta e provisione o banco de dados:**  
   Siga as instruções do provedor para criar um novo banco de dados PostgreSQL.

3. **Obtenha a string de conexão:**  
   Após a criação, localize o parâmetro de conexão (exemplo: `postgres://usuario:senha@host:porta/nome_do_banco`).

4. **Configure no Vercel:**  
   No painél do Vercel, adicione a variável de ambiente `POSTGRES_URL` com o valor da sua string de conexão.

5. **Teste a conexão:**  
   Utilize a função serverless `/api/db` para verificar se a conexão está funcionando corretamente.
