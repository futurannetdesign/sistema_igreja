const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

// Configure o pool como no server.js
const pool = new Pool({
  user: "seu_usuario",
  host: "localhost",
  database: "nome_do_banco",
  password: "sua_senha",
  port: 5432,
});

// Chave secreta para assinar os tokens (mantenha-a segura)
const SECRET_KEY = "sua_chave_secreta";

// Função para realizar o login com validação de senha
async function login(email, password) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.rows.length === 0) throw new Error("Usuário não encontrado");

  const user = result.rows[0];
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) throw new Error("Senha inválida");

  // Remova informações sensíveis antes de assinar o token
  delete user.password;

  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
  return token;
}

// Middleware para verificar token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = { login, authenticateToken };
