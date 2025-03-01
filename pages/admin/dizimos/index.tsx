import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectedLayout } from "../../../components/ProtectedLayout";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useUserRole } from "../../../hooks/useUserRole";

interface Dizimo {
  id: string;
  membro_id: string;
  membro_nome: string;
  valor: number;
  data: string;
  tipo: "dizimo" | "oferta";
  observacao?: string;
}

interface Membro {
  id: string;
  nome: string;
}

function DizimosPage() {
  const role = useUserRole();
  const [dizimos, setDizimos] = useState<Dizimo[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDizimo, setCurrentDizimo] = useState<Partial<Dizimo>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchDizimos();
    fetchMembros();
  }, []);

  const fetchDizimos = async () => {
    const { data, error } = await supabase
      .from("dizimos")
      .select(
        `
        *,
        membros (
          id,
          nome
        )
      `
      )
      .order("data", { ascending: false });

    if (error) {
      console.error("Erro ao buscar dízimos:", error);
      return;
    }

    setDizimos(
      data.map((d) => ({
        ...d,
        membro_nome: d.membros.nome,
      }))
    );
  };

  const fetchMembros = async () => {
    const { data, error } = await supabase
      .from("membros")
      .select("id, nome")
      .order("nome");

    if (error) {
      console.error("Erro ao buscar membros:", error);
      return;
    }

    setMembros(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validar valor
      if (!currentDizimo.valor || currentDizimo.valor <= 0) {
        throw new Error("O valor deve ser maior que zero");
      }

      // Validar data
      if (!currentDizimo.data) {
        throw new Error("A data é obrigatória");
      }

      // Ajuste para garantir que a data seja salva corretamente
      const dataAjustada = new Date(currentDizimo.data + "T12:00:00");

      const dizimoData = {
        membro_id: currentDizimo.membro_id,
        valor: currentDizimo.valor,
        data: dataAjustada.toISOString().split("T")[0], // Garante formato YYYY-MM-DD
        tipo: currentDizimo.tipo || "dizimo",
        observacao: currentDizimo.observacao || null,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("dizimos")
          .update(dizimoData)
          .eq("id", currentDizimo.id);

        if (error) {
          console.error("Erro na atualização:", error);
          throw new Error(error.message);
        }
      } else {
        const { error } = await supabase.from("dizimos").insert([dizimoData]);

        if (error) {
          console.error("Erro na inserção:", error);
          throw new Error(error.message);
        }
      }

      setShowModal(false);
      fetchDizimos();
    } catch (error: any) {
      console.error("Erro:", error);
      alert(error.message || "Erro ao salvar dízimo. Verifique os dados.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      try {
        const { error } = await supabase.from("dizimos").delete().eq("id", id);

        if (error) throw error;
        fetchDizimos();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir registro");
      }
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString + "T12:00:00");
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  };

  if (!role) return null; // Aguarda o role ser carregado

  return (
    <AdminLayout title="Gestão de Dízimos" role={role}>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dízimos e Ofertas</h2>
        <button
          onClick={() => {
            setCurrentDizimo({});
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 shadow-md"
        >
          <FaPlus /> Novo Registro
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Membro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {dizimos.map((dizimo) => (
              <tr key={dizimo.id} className="border-t border-gray-200">
                <td className="px-6 py-4">{formatarData(dizimo.data)}</td>
                <td className="px-6 py-4">{dizimo.membro_nome}</td>
                <td className="px-6 py-4 capitalize">{dizimo.tipo}</td>
                <td className="px-6 py-4">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(dizimo.valor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentDizimo(dizimo);
                      setIsEditing(true);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4 shadow-sm hover:shadow-md p-2 rounded transition-all transform hover:scale-110"
                  >
                    <FaEdit className="inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(dizimo.id)}
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
                {isEditing ? "Editar Registro" : "Novo Registro"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Membro
                </label>
                <select
                  value={currentDizimo.membro_id || ""}
                  onChange={(e) =>
                    setCurrentDizimo({
                      ...currentDizimo,
                      membro_id: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um membro</option>
                  {membros.map((membro) => (
                    <option key={membro.id} value={membro.id}>
                      {membro.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  value={currentDizimo.tipo || "dizimo"}
                  onChange={(e) =>
                    setCurrentDizimo({
                      ...currentDizimo,
                      tipo: e.target.value as "dizimo" | "oferta",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="dizimo">Dízimo</option>
                  <option value="oferta">Oferta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentDizimo.valor || ""}
                  onChange={(e) =>
                    setCurrentDizimo({
                      ...currentDizimo,
                      valor: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  value={currentDizimo.data || ""}
                  onChange={(e) =>
                    setCurrentDizimo({ ...currentDizimo, data: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Observação
                </label>
                <textarea
                  value={currentDizimo.observacao || ""}
                  onChange={(e) =>
                    setCurrentDizimo({
                      ...currentDizimo,
                      observacao: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
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

export default ProtectedLayout(DizimosPage, {
  allowedRoles: ["admin", "secretary"],
});
