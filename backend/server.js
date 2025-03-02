const express = require("express");
const path = require("path");
const helmet = require("helmet");
const { Pool } = require("pg");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const logger = require("./logger");
const auth = require("./auth");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rota para servir arquivos estáticos da pasta "pages"
app.use(express.static(path.join(__dirname, "../pages")));

// Configuração do PostgreSQL (substitua os valores conforme sua configuração)
const pool = new Pool({
  user: "seu_usuario", // usuário do PostgreSQL
  host: "localhost",
  database: "nome_do_banco", // nome do banco de dados
  password: "sua_senha", // senha
  port: 5432,
});

// Endpoint de login com validação de inputs
app.post(
  "/api/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { email, password } = req.body;
      const token = await auth.login(email, password);
      res.json({ token });
    } catch (error) {
      logger.error("Erro no login", error);
      next(error);
    }
  }
);

// Protege o endpoint com o middleware de autenticação
app.get("/api/members", auth.authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM members");
    res.json(result.rows);
  } catch (error) {
    logger.error("Erro ao buscar membros", error);
    next(error);
  }
});

// Criação de novo membro com validação de inputs
app.post(
  "/api/members",
  [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("birthDate").isDate().withMessage("Data de nascimento inválida"),
    body("phone").trim().notEmpty().withMessage("Telefone é obrigatório"),
    // Outras validações podem ser adicionadas conforme necessário
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { name, birthDate, baptismDate, phone, photo } = req.body;
      const result = await pool.query(
        "INSERT INTO members(name, birthDate, baptismDate, phone, photo) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [
          name,
          birthDate,
          baptismDate || null,
          phone,
          photo || "../../assets/avatar-placeholder.png",
        ]
      );
      res.json(result.rows[0]);
    } catch (error) {
      logger.error("Erro ao criar membro", error);
      next(error);
    }
  }
);

// Adicione a rota para a página LGPD
app.get("/lgpd", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/lgpd.html"));
});

// Middleware centralizado para tratamento de erros
app.use((err, req, res, next) => {
  logger.error("Erro centralizado:", err);
  res
    .status(500)
    .json({ error: "Ocorreu um erro interno. Tente novamente mais tarde." });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => logger.info(`Servidor rodando na porta ${PORT}`));
} else {
  module.exports = app;
}
