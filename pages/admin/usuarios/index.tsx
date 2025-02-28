import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectedLayout } from "../../../components/ProtectedLayout";
import { supabase } from "../../../lib/supabase";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

interface Usuario {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in: string;
}

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Partial<Usuario>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Erro ao buscar usuários");

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Erro ao carregar usuários. Por favor, tente novamente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Atualizar role do usuário
        const { error } = await supabase
          .from("user_roles")
          .update({ role: currentUsuario.role })
          .eq("user_id", currentUsuario.id);

        if (error) throw error;
      } else {
        // Verificar senha
        if (password.length < 6) {
          throw new Error("A senha deve ter no mínimo 6 caracteres");
        }

        // Criar novo usuário com a senha fornecida
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: currentUsuario.email!,
          password: password,
        });

        if (signUpError) throw signUpError;

        // Adicionar role para o novo usuário
        if (data.user) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert([
              {
                user_id: data.user.id,
                role: currentUsuario.role || "secretary",
              },
            ]);

          if (roleError) throw roleError;
        }
      }

      setShowModal(false);
      setPassword(""); // Limpar senha
      fetchUsuarios();
    } catch (error: any) {
      console.error("Erro:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await fetch(`/api/users?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Erro ao excluir usuário");

        fetchUsuarios();
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao excluir usuário");
      }
    }
  };

  return (
    <AdminLayout title="Gestão de Usuários" role="admin">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Usuários</h2>
        <button
          onClick={() => {
            setCurrentUsuario({});
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 shadow-md transform hover:scale-105 transition-all"
        >
          <FaUserPlus /> Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Papel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Acesso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {usuario.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${usuario.role === "admin" ? "bg-red-100 text-red-800" : ""}
                    ${
                      usuario.role === "pastor"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      usuario.role === "secretary"
                        ? "bg-blue-100 text-blue-800"
                        : ""
                    }
                  `}
                  >
                    {usuario.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(usuario.last_sign_in || "").toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentUsuario(usuario);
                      setIsEditing(true);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4 shadow-sm hover:shadow-md p-2 rounded transition-all transform hover:scale-110"
                  >
                    <FaEdit className="inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="text-red-600 hover:text-red-900 shadow-sm hover:shadow-md p-2 rounded transition-all transform hover:scale-110"
                  >
                    <FaTrash className="inline mr-1" />
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {isEditing ? "Editar Usuário" : "Novo Usuário"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUsuario.email || ""}
                  onChange={(e) =>
                    setCurrentUsuario({
                      ...currentUsuario,
                      email: e.target.value,
                    })
                  }
                  disabled={isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Papel
                </label>
                <select
                  value={currentUsuario.role || "visitor"}
                  onChange={(e) =>
                    setCurrentUsuario({
                      ...currentUsuario,
                      role: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="visitor">Visitante</option>
                  <option value="secretary">Secretário(a)</option>
                  <option value="pastor">Pastor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 shadow hover:shadow-md transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 shadow hover:shadow-md transition-all"
                >
                  {isEditing ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default ProtectedLayout(UsuariosPage, { allowedRoles: ["admin"] });
