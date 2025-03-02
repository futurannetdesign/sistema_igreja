import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectedLayout } from "../../../components/ProtectedLayout";
import { supabase } from "../../../lib/supabase";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaWhatsapp, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useUserRole } from "../../../hooks/useUserRole";

interface Membro {
  id: string; // Mudado de number para string (UUID)
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  endereco: string;
  data_batismo?: string;
  created_at: string;
}

function MembrosPage() {
  const role = useUserRole();
  const [membros, setMembros] = useState<Membro[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMembro, setCurrentMembro] = useState<Partial<Membro>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMembros();
  }, []);

  const fetchMembros = async () => {
    const { data, error } = await supabase
      .from("membros")
      .select("*")
      .order("nome");

    if (error) console.error("Erro ao buscar membros:", error);
    else setMembros(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Remover campos undefined ou vazios
      const membroData = {
        nome: currentMembro.nome?.trim(),
        email: currentMembro.email?.trim() || null,
        telefone: currentMembro.telefone?.trim(),
        data_nascimento: currentMembro.data_nascimento
          ? new Date(currentMembro.data_nascimento).toISOString().split("T")[0]
          : null,
        endereco: currentMembro.endereco?.trim() || null,
        data_batismo: currentMembro.data_batismo
          ? new Date(currentMembro.data_batismo).toISOString().split("T")[0]
          : null,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (isEditing && currentMembro.id) {
        const { error: updateError } = await supabase
          .from("membros")
          .update(membroData)
          .eq("id", currentMembro.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("membros")
          .insert([membroData]);
        error = insertError;
      }

      if (error) throw error;

      setShowModal(false);
      setCurrentMembro({});
      await fetchMembros();
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      alert(error.message || "Erro ao salvar membro");
    }
  };

  // Corrigido o tipo do parâmetro id para string
  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este membro?")) {
      try {
        const { error } = await supabase.from("membros").delete().eq("id", id);

        if (error) throw error;
        await fetchMembros();
      } catch (error: any) {
        console.error("Erro ao excluir:", error);
        alert(error.message || "Erro ao excluir membro");
      }
    }
  };

  // Atualizar a exibição das datas na tabela
  const formatarData = (data: string) => {
    if (!data) return "";
    // Usar parseISO para garantir que a data seja interpretada corretamente
    return format(parseISO(data), "dd/MM/yyyy", { locale: ptBR });
  };

  if (!role) return null; // Aguarda o role ser carregado

  return (
    <AdminLayout title="Gestão de Membros" role={role}>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Membros</h2>
        <button
          onClick={() => {
            setCurrentMembro({});
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus /> Novo Membro
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Nasc.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batismo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {membros.map((membro) => (
              <tr key={membro.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{membro.nome}</div>
                  <div className="text-sm text-gray-500">{membro.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{membro.telefone}</div>
                  <a
                    href={`https://wa.me/${membro.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaWhatsapp className="inline mr-1" />
                    WhatsApp
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatarData(membro.data_nascimento)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {membro.data_batismo
                    ? formatarData(membro.data_batismo)
                    : "Não batizado"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentMembro(membro);
                      setIsEditing(true);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit className="inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(membro.id)}
                    className="text-red-600 hover:text-red-900"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  {isEditing ? "Editar Membro" : "Novo Membro"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={currentMembro.nome || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        nome: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={currentMembro.email || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefone/WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={currentMembro.telefone || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        telefone: e.target.value,
                      })
                    }
                    placeholder="(00) 00000-0000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={currentMembro.data_nascimento || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        data_nascimento: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Endereço
                  </label>
                  <textarea
                    value={currentMembro.endereco || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        endereco: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Batismo
                  </label>
                  <input
                    type="date"
                    value={currentMembro.data_batismo || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        data_batismo: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
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

export default ProtectedLayout(MembrosPage, {
  allowedRoles: ["admin", "secretary", "pastor"], // Permitir acesso para todos os papéis
});
