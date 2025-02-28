import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        // Lista todos os usuários
        const {
          data: { users },
          error: authError,
        } = await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        // Busca os roles
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("*");
        if (rolesError) throw rolesError;

        // Combina os dados
        const usersWithRoles = users.map((user) => ({
          id: user.id,
          email: user.email,
          role: roles?.find((r) => r.user_id === user.id)?.role || "visitor",
          created_at: user.created_at,
          last_sign_in: user.last_sign_in_at,
        }));

        res.status(200).json(usersWithRoles);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error fetching users" });
      }
      break;

    case "POST":
      try {
        const { email, password, role } = req.body;

        // Verificar se o usuário já existe
        const { data: existingUsers, error: checkError } = await supabase
          .from("auth.users")
          .select("email")
          .eq("email", email);

        if (existingUsers?.length) {
          return res.status(400).json({ error: "Usuário já existe" });
        }

        // Criar usuário
        const {
          data: { user },
          error: createError,
        } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { role },
        });

        if (createError) throw createError;

        if (user) {
          // Adicionar role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert([{ user_id: user.id, role }]);

          if (roleError) throw roleError;
        }

        res.status(201).json({ user });
      } catch (error: any) {
        console.error("Erro ao criar usuário:", error);
        res
          .status(500)
          .json({ error: error.message || "Erro ao criar usuário" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;

        // Remover role primeiro
        await supabase.from("user_roles").delete().eq("user_id", id);

        // Depois remover o usuário
        const { error } = await supabase.auth.admin.deleteUser(id as string);

        if (error) throw error;
        res.status(200).json({ message: "Usuário deletado com sucesso" });
      } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
