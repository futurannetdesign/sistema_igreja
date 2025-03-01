import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectedLayout } from "../../../components/ProtectedLayout";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaPlus, FaEdit, FaTrash, FaWhatsapp } from "react-icons/fa";
import { SystemError } from "../../../types/error";

interface MembroEfetivo {
  id: string;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  data_batismo?: string | null;
  cargo_ministerial?: string | null;
  data_membro: string;
  status: "ativo" | "inativo";
  observacoes?: string | null;
}

function MembrosEfetivosPage(): JSX.Element {
  const [membros, setMembros] = useState<MembroEfetivo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMembro, setCurrentMembro] = useState<Partial<MembroEfetivo>>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);

  const fetchMembrosEfetivos = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("membros_efetivos")
        .select("*")
        .order("nome");

      if (error) throw error;
      setMembros(data || []);
    } catch (error) {
      console.error("Erro ao buscar membros efetivos:", error);
      alert("Erro ao carregar membros efetivos");
    }
  }, []);

  useEffect(() => {
    void fetchMembrosEfetivos();
  }, [fetchMembrosEfetivos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validações básicas
      if (!currentMembro.nome?.trim()) {
        throw new Error("O nome é obrigatório");
      }
      if (!currentMembro.data_membro) {
        throw new Error("A data como membro é obrigatória");
      }

      // Verificar duplicata
      const { data: existingMembro } = await supabase
        .from("membros_efetivos")
        .select("id")
        .eq("nome", currentMembro.nome.trim())
        .eq("data_batismo", currentMembro.data_batismo)
        .maybeSingle();

      if (
        existingMembro &&
        (!isEditing || existingMembro.id !== currentMembro.id)
      ) {
        throw new Error(
          "Já existe um membro efetivo com este nome e data de batismo"
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Ajustar fuso horário para datas - correção do tipo do parâmetro
      const ajustarData = (
        dataString: string | undefined | null
      ): string | null => {
        if (!dataString) return null;
        const data = new Date(dataString);
        data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
        return data.toISOString().split("T")[0];
      };

      const membroData = {
        ...currentMembro,
        nome: currentMembro.nome?.trim(),
        email: currentMembro.email?.trim() || null,
        telefone: currentMembro.telefone?.trim() || null,
        data_batismo: ajustarData(currentMembro.data_batismo),
        data_membro: ajustarData(currentMembro.data_membro),
        cargo_ministerial: currentMembro.cargo_ministerial?.trim() || null,
        status: currentMembro.status || "ativo",
        observacoes: currentMembro.observacoes?.trim() || null,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      };

      // Log para debug
      console.log("Dados a serem salvos:", membroData);

      if (isEditing && currentMembro.id) {
        const { error } = await supabase
          .from("membros_efetivos")
          .update(membroData)
          .eq("id", currentMembro.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("membros_efetivos")
          .insert([{ ...membroData, created_by: user.id }]);

        if (error) throw error;
      }

      setShowModal(false);
      setCurrentMembro({});
      await fetchMembrosEfetivos();
    } catch (error: unknown) {
      const err = error as SystemError;
      console.error("Erro detalhado:", err);
      alert(err.message || "Erro ao salvar membro efetivo");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este membro efetivo?")) {
      try {
        const { error } = await supabase
          .from("membros_efetivos")
          .delete()
          .eq("id", id);

        if (error) throw error;
        await fetchMembrosEfetivos();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir membro efetivo");
      }
    }
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    // Ajusta o fuso horário para exibição
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <AdminLayout title="Membros Efetivos" role="admin">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Membros Efetivos</h2>
        <button
          onClick={() => {
            setCurrentMembro({});
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Novo Membro Efetivo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data Membro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cargo Ministerial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {membros.map((membro) => (
              <tr key={membro.id} className="border-t border-gray-200">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{membro.nome}</div>
                  <div className="text-sm text-gray-500">
                    {membro.email}
                    {membro.telefone && (
                      <div className="mt-1">
                        <span className="text-gray-600">{membro.telefone}</span>
                        <a
                          href={`https://wa.me/${membro.telefone.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-green-500 hover:text-green-700 inline-flex items-center"
                        >
                          <FaWhatsapp className="mr-1" />
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatarData(membro.data_membro)}
                </td>
                <td className="px-6 py-4">{membro.cargo_ministerial || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      membro.status === "ativo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {membro.status}
                  </span>
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
                    <FaEdit className="inline mr-1" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(membro.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="inline mr-1" /> Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-4 relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pb-3 mb-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Editar Membro Efetivo" : "Novo Membro Efetivo"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCurrentMembro({});
                  }}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
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
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data como Membro
                  </label>
                  <input
                    type="date"
                    value={currentMembro.data_membro || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        data_membro: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo Ministerial
                  </label>
                  <input
                    type="text"
                    value={currentMembro.cargo_ministerial || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        cargo_ministerial: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={currentMembro.status || "ativo"}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        status: e.target.value as "ativo" | "inativo",
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={currentMembro.observacoes || ""}
                    onChange={(e) =>
                      setCurrentMembro({
                        ...currentMembro,
                        observacoes: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setCurrentMembro({});
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
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

export default ProtectedLayout(MembrosEfetivosPage, {
  allowedRoles: ["admin", "pastor", "secretary"],
});
