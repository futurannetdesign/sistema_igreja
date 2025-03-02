import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case "GET":
      try {
        const { data, error } = await supabase.from("membros").select("*");

        if (error) throw error;
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar membros" });
      }

    case "POST":
      try {
        const { data, error } = await supabase
          .from("membros")
          .insert([req.body]);

        if (error) throw error;
        return res.status(201).json(data);
      } catch (error) {
        return res.status(500).json({ error: "Erro ao criar membro" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
