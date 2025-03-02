import { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

// Configuração do pool de conexões com o PostgreSQL utilizando a variável de ambiente POSTGRES_URL com asserção não nula
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL!, // garante que o valor não é undefined
});

// Função handler que executa uma query de exemplo (SELECT NOW())
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();

    res.status(200).json({ serverTime: result.rows[0] });
  } catch (error) {
    console.error("Erro na conexão com o banco:", error);
    res.status(500).json({ error: "Erro na conexão com o banco de dados." });
  }
}
