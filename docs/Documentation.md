# Documentação do Sistema de Gestão da Igreja

## 1. Introdução

Este sistema foi desenvolvido para gerenciar os membros, batismos e relatórios da igreja. Ele integra uma API backend (usando Node.js, Express e PostgreSQL) e um front-end que atende os perfis de administrador, secretário e pastor.

## 2. Arquitetura do Sistema

- **Backend:** Node.js com Express, PostgreSQL para persistência, e Winston para logging.
- **Front-end:** Páginas HTML, CSS responsivos e JavaScript.
- **CI/CD:** Pipeline configurado com GitHub Actions para testes e deploy.
- **Monitoramento e Backup:** Processos planejados para garantir alta disponibilidade e recuperação de dados.

## 3. Instalação e Configuração

### 3.1 Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- npm
- Git

### 3.2 Configuração do Banco de Dados

1. Crie um banco de dados no PostgreSQL.
2. Atualize as configurações de conexão em `/H:/sistema_igreja/backend/server.js` (usuário, senha, nome do banco).

### 3.3 Instalar Dependências e Rodar o Servidor

```bash
cd /H:/sistema_igreja/backend
npm install
node server.js
```

## 4. Endpoints da API

- **GET /api/members:** Retorna todos os membros.
- **POST /api/members:** Cria um novo membro.
- _(Endpoints PUT e DELETE devem ser implementados conforme necessário.)_

### Exemplo de request para criação de membro:

```json
{
  "name": "João Silva",
  "birthDate": "1990-05-15",
  "baptismDate": "2010-03-20",
  "phone": "(11) 98765-4321",
  "photo": "URL da foto ou caminho"
}
```

## 5. Treinamento e Suporte

- **Usuários:** Manuais de uso para o painel de administração, secretaria e pastores.
- **Desenvolvedores:** Guia de contribuição, testes automatizados (consulta o diretório /H:/sistema_igreja/tests) e melhores práticas de codificação.
- **Atualizações:** Utilização do pipeline CI/CD para garantia de qualidade e deploys seguros.

## 6. Contato e Suporte Técnico

- [Insira informações de contato para suporte da equipe de TI.]

---

Este documento deve ser atualizado à medida que novas funcionalidades sejam implementadas e ajustes na infraestrutura sejam realizados.
