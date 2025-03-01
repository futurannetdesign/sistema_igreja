import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectedLayout } from "../../../components/ProtectedLayout";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaPlus, FaEdit, FaTrash, FaCalendar } from "react-icons/fa";

interface EventoPastoral {
  id: string;
  tipo: "culto" | "visita" | "conversao" | "agenda";
  titulo: string;
  descricao?: string;
  data_evento: string;
  status: "pendente" | "realizado" | "cancelado";
  pessoa_envolvida?: string;
  local?: string;
  observacoes?: string;
}

function PastorDashboard() {
  const [eventos, setEventos] = useState<EventoPastoral[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvento, setCurrentEvento] = useState<Partial<EventoPastoral>>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<
    EventoPastoral["tipo"] | "todos"
  >("todos");

  // Adicionar estado para contadores do mês atual
  const [dashboardStats, setDashboardStats] = useState({
    cultosMes: 0,
    visitasMes: 0,
    conversoesMes: 0,
    agendasMes: 0,
  });

  useEffect(() => {
    fetchEventos();
    calculateMonthlyStats();
  }, []);

  const fetchEventos = async () => {
    const { data, error } = await supabase
      .from("eventos_pastorais")
      .select("*")
      .order("data_evento", { ascending: false });

    if (error) {
      console.error("Erro ao buscar eventos:", error);
      return;
    }

    setEventos(data || []);
  };

  // Adicionar função para calcular estatísticas do mês
  const calculateMonthlyStats = () => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const eventosMes = eventos.filter((evento) => {
      const dataEvento = new Date(evento.data_evento);
      return dataEvento >= primeiroDiaMes && dataEvento <= ultimoDiaMes;
    });

    setDashboardStats({
      cultosMes: eventosMes.filter((e) => e.tipo === "culto").length,
      visitasMes: eventosMes.filter((e) => e.tipo === "visita").length,
      conversoesMes: eventosMes.filter((e) => e.tipo === "conversao").length,
      agendasMes: eventosMes.filter((e) => e.tipo === "agenda").length,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validação melhorada dos campos obrigatórios
      if (!currentEvento.titulo?.trim()) {
        throw new Error("O título é obrigatório");
      }

      // Validação específica para o tipo de evento
      const tiposValidos = ["culto", "visita", "conversao", "agenda"] as const;
      if (
        !currentEvento.tipo ||
        !tiposValidos.includes(currentEvento.tipo as any)
      ) {
        throw new Error("Selecione um tipo de evento válido");
      }

      if (!currentEvento.data_evento) {
        throw new Error("A data do evento é obrigatória");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const eventoData = {
        titulo: currentEvento.titulo.trim(),
        tipo: currentEvento.tipo,
        data_evento: new Date(currentEvento.data_evento).toISOString(),
        status: currentEvento.status || "pendente",
        local: currentEvento.local?.trim() || null,
        pessoa_envolvida: currentEvento.pessoa_envolvida?.trim() || null,
        observacoes: currentEvento.observacoes?.trim() || null,
        created_by: user.id,
      };

      console.log("Dados a serem salvos:", eventoData); // Para debug

      if (isEditing && currentEvento.id) {
        const { error } = await supabase
          .from("eventos_pastorais")
          .update(eventoData)
          .eq("id", currentEvento.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("eventos_pastorais")
          .insert([eventoData]);

        if (error) throw error;
      }

      setShowModal(false);
      setCurrentEvento({});
      await fetchEventos();
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      alert(error.message || "Erro ao salvar evento");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      const { error } = await supabase
        .from("eventos_pastorais")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir evento");
        return;
      }

      await fetchEventos();
    }
  };

  const eventosFiltrados = eventos.filter((evento) =>
    filtroTipo === "todos" ? true : evento.tipo === filtroTipo
  );

  return (
    <AdminLayout title="Dashboard Pastoral" role="pastor">
      {/* Cards de resumo do mês */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-blue-800">Cultos do Mês</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {dashboardStats.cultosMes}
          </p>
          <p className="text-sm text-blue-500 mt-1">
            Total de cultos realizados
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-green-800">
            Visitas Pastorais
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {dashboardStats.visitasMes}
          </p>
          <p className="text-sm text-green-500 mt-1">Visitas realizadas</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-yellow-800">
            Novos Convertidos
          </h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {dashboardStats.conversoesMes}
          </p>
          <p className="text-sm text-yellow-500 mt-1">Conversões este mês</p>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-purple-800">Agenda Pastoral</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {dashboardStats.agendasMes}
          </p>
          <p className="text-sm text-purple-500 mt-1">Compromissos agendados</p>
        </div>
      </div>

      {/* Próximos Eventos */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Próximos Eventos
        </h3>
        <div className="grid gap-4">
          {eventos
            .filter((evento) => new Date(evento.data_evento) >= new Date())
            .sort(
              (a, b) =>
                new Date(a.data_evento).getTime() -
                new Date(b.data_evento).getTime()
            )
            .slice(0, 5)
            .map((evento) => (
              <div
                key={evento.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold">{evento.titulo}</p>
                  <p className="text-sm text-gray-600">
                    {format(
                      new Date(evento.data_evento),
                      "dd/MM/yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    evento.status === "pendente"
                      ? "bg-yellow-100 text-yellow-800"
                      : ""
                  }
                  ${
                    evento.status === "realizado"
                      ? "bg-green-100 text-green-800"
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
            ))}
        </div>
      </div>

      {/* Controles e Filtros */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="rounded-md border-gray-300"
          >
            <option value="todos">Todos os Eventos</option>
            <option value="culto">Cultos</option>
            <option value="visita">Visitas</option>
            <option value="conversao">Conversões</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
        <button
          onClick={() => {
            setCurrentEvento({});
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Novo Evento
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventosFiltrados.map((evento) => (
          <div
            key={evento.id}
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 
              ${evento.status === "realizado" ? "border-green-500" : ""}
              ${evento.status === "pendente" ? "border-yellow-500" : ""}
              ${evento.status === "cancelado" ? "border-red-500" : ""}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{evento.titulo}</h3>
                <p className="text-sm text-gray-500">{evento.tipo}</p>
              </div>
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
            <div className="mt-2">
              <p className="text-sm flex items-center gap-1">
                <FaCalendar />
                {format(new Date(evento.data_evento), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}
              </p>
              {evento.local && <p className="text-sm">{evento.local}</p>}
              {evento.pessoa_envolvida && (
                <p className="text-sm">Pessoa: {evento.pessoa_envolvida}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-4 relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white pb-3 mb-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Editar Evento" : "Novo Evento"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCurrentEvento({});
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
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={currentEvento.tipo || "culto"}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        tipo: e.target.value as EventoPastoral["tipo"],
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="culto">Culto</option>
                    <option value="visita">Visita Pastoral</option>
                    <option value="conversao">Novo Convertido</option>
                    <option value="agenda">Agenda Pastoral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={currentEvento.status || "pendente"}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        status: e.target.value as EventoPastoral["status"],
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="pendente">Pendente</option>
                    <option value="realizado">Realizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    value={currentEvento.data_evento?.slice(0, 16) || ""}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        data_evento: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pessoa Envolvida
                  </label>
                  <input
                    type="text"
                    value={currentEvento.pessoa_envolvida || ""}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        pessoa_envolvida: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={currentEvento.observacoes || ""}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
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
                    setCurrentEvento({});
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

export default ProtectedLayout(PastorDashboard, { allowedRoles: ["pastor"] });
