import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectedLayout } from "../../../components/ProtectedLayout";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaPlus, FaEdit, FaTrash, FaCalendar } from "react-icons/fa";

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  tipo: "culto" | "reuniao" | "especial";
  status: "pendente" | "confirmado" | "cancelado";
  responsavel: { id: string; email: string };
}

function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvento, setCurrentEvento] = useState<Partial<Evento>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Modificada a query para não usar join
      const { data, error } = await supabase
        .from("eventos")
        .select("*") // Removido o join que estava causando o erro
        .order("data_inicio", { ascending: false });

      if (error) {
        console.error("Erro detalhado:", error);
        throw error;
      }

      console.log("Eventos carregados:", data);
      setEventos(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar eventos:", error);
      alert(error.message || "Erro ao carregar eventos");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !currentEvento.titulo ||
        !currentEvento.data_inicio ||
        !currentEvento.data_fim ||
        !currentEvento.local
      ) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não autenticado");

      // Preparar dados do evento
      const eventoData = {
        titulo: currentEvento.titulo.trim(),
        descricao: currentEvento.descricao?.trim() || "",
        data_inicio: new Date(currentEvento.data_inicio).toISOString(),
        data_fim: new Date(currentEvento.data_fim).toISOString(),
        local: currentEvento.local.trim(),
        tipo: currentEvento.tipo || "culto",
        status: currentEvento.status || "pendente",
        responsavel_id: user.id,
        created_by: user.id,
      };

      console.log("Dados a serem salvos:", eventoData);

      let error;
      if (isEditing && currentEvento.id) {
        const { error: updateError } = await supabase
          .from("eventos")
          .update(eventoData)
          .eq("id", currentEvento.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("eventos")
          .insert([eventoData]);
        error = insertError;
      }

      if (error) throw error;

      setShowModal(false);
      setCurrentEvento({});
      await fetchEventos(); // Recarregar eventos imediatamente
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.message || "Erro ao salvar evento");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        const { error } = await supabase.from("eventos").delete().eq("id", id);

        if (error) throw error;
        fetchEventos();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir evento");
      }
    }
  };

  return (
    <AdminLayout title="Gestão de Eventos" role="admin">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Eventos</h2>
        <button
          onClick={() => {
            setCurrentEvento({});
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 shadow-md"
        >
          <FaPlus /> Novo Evento
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 
              ${evento.status === "confirmado" ? "border-green-500" : ""}
              ${evento.status === "pendente" ? "border-yellow-500" : ""}
              ${evento.status === "cancelado" ? "border-red-500" : ""}
            `}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{evento.titulo}</h3>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setCurrentEvento(evento);
                    setIsEditing(true);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(evento.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="mt-2 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <FaCalendar />
                {format(new Date(evento.data_inicio), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}
              </p>
              <p>{evento.local}</p>
              <p className="text-gray-500">{evento.descricao}</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                  ${
                    evento.status === "confirmado"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                  ${
                    evento.status === "pendente"
                      ? "bg-yellow-100 text-yellow-800"
                      : ""
                  }
                  ${
                    evento.status === "cancelado"
                      ? "bg-red-100 text-red-800"
                      : ""
                  }
                `}
              >
                {evento.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {isEditing ? "Editar Evento" : "Novo Evento"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    value={currentEvento.titulo || ""}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        titulo: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data/Hora Início
                  </label>
                  <input
                    type="datetime-local"
                    value={currentEvento.data_inicio || ""}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        data_inicio: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data/Hora Fim
                  </label>
                  <input
                    type="datetime-local"
                    value={currentEvento.data_fim || ""}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        data_fim: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    value={currentEvento.tipo || "culto"}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        tipo: e.target.value as
                          | "culto"
                          | "reuniao"
                          | "especial",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="culto">Culto</option>
                    <option value="reuniao">Reunião</option>
                    <option value="especial">Especial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={currentEvento.status || "pendente"}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        status: e.target.value as
                          | "pendente"
                          | "confirmado"
                          | "cancelado",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Local
                  </label>
                  <input
                    type="text"
                    value={currentEvento.local || ""}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        local: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    value={currentEvento.descricao || ""}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        descricao: e.target.value,
                      })
                    }
                    rows={3}
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

export default ProtectedLayout(EventosPage, {
  allowedRoles: ["admin", "pastor", "secretary"],
});
