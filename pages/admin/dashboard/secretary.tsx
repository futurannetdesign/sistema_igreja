import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectedLayout } from "../../../components/ProtectedLayout";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaUsers, FaBirthdayCake, FaCalendarWeek } from "react-icons/fa";

interface SecretaryStats {
  totalMembros: number;
  totalDizimos: number;
  dizimosMes: number;
  membrosEfetivos: {
    total: number;
    ativos: number;
    inativos: number;
  };
  aniversariantes: number;
  eventosSemana: number;
}

function SecretaryDashboard() {
  const [stats, setStats] = useState<SecretaryStats>({
    totalMembros: 0,
    totalDizimos: 0,
    dizimosMes: 0,
    membrosEfetivos: {
      total: 0,
      ativos: 0,
      inativos: 0,
    },
    aniversariantes: 0,
    eventosSemana: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6);

      // Consulta corrigida para aniversariantes
      const { data: aniversariantes, error: anivError } = await supabase
        .from("membros")
        .select("*")
        .or(
          `and(data_nascimento.neq.null,extract(month from data_nascimento::date)=${mesAtual})`
        );

      if (anivError) {
        console.error("Erro ao buscar aniversariantes:", anivError);
      } else {
        console.log(
          "Aniversariantes encontrados:",
          aniversariantes?.length || 0
        );
      }

      // Consultas paralelas para todas as fontes de dados
      const [
        { data: membrosEfetivos },
        { data: membrosComuns },
        { data: eventos },
        { data: dizimos },
      ] = await Promise.all([
        // Membros efetivos (todos)
        supabase.from("membros_efetivos").select("*"),

        // Membros comuns (todos)
        supabase.from("membros").select("*"),

        // Eventos (da semana atual)
        supabase
          .from("eventos")
          .select("*")
          .gte("data_evento", inicioSemana.toISOString())
          .lt("data_evento", fimSemana.toISOString()),

        // Dízimos (do mês atual)
        supabase
          .from("dizimos")
          .select("*")
          .gte("data", inicioMes.toISOString())
          .lt("data", fimMes.toISOString()),
      ]);

      // Eventos pastorais (da semana)
      const { data: eventosPastorais } = await supabase
        .from("eventos_pastorais")
        .select("*")
        .gte("data_evento", inicioSemana.toISOString())
        .lt("data_evento", fimSemana.toISOString());

      // Cálculos dos totais
      const membrosEfetivosAtivos =
        membrosEfetivos?.filter((m) => m.status === "ativo") || [];
      const totalDizimos =
        dizimos?.reduce((acc, d) => acc + Number(d.valor), 0) || 0;
      const totalEventos =
        (eventos?.length || 0) + (eventosPastorais?.length || 0);

      setStats({
        totalMembros:
          (membrosComuns?.length || 0) + (membrosEfetivos?.length || 0),
        membrosEfetivos: {
          total: membrosEfetivos?.length || 0,
          ativos: membrosEfetivosAtivos.length,
          inativos:
            (membrosEfetivos?.length || 0) - membrosEfetivosAtivos.length,
        },
        aniversariantes: aniversariantes?.length || 0,
        eventosSemana: totalEventos,
        totalDizimos: totalDizimos,
        dizimosMes: totalDizimos,
      });

      console.log("Dados atualizados:", {
        membrosEfetivos: membrosEfetivos?.length,
        membrosComuns: membrosComuns?.length,
        eventos: eventos?.length,
        eventosPastorais: eventosPastorais?.length,
        dizimos: dizimos?.length,
        aniversariantes: aniversariantes?.length,
      });

      // Debug log
      console.log("Debug aniversariantes:", {
        mesAtual,
        total: aniversariantes?.length || 0,
        aniversariantes: aniversariantes?.map((m) => ({
          nome: m.nome,
          data: m.data_nascimento,
        })),
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Atualizar a cada minuto
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout title="Painel da Secretaria" role="secretary">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Novo Card de Membros Totais */}
        <div className="bg-indigo-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaUsers className="text-indigo-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-indigo-800">
                Total de Membros
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.totalMembros}
              </p>
              <p className="text-sm text-indigo-600">cadastrados</p>
            </div>
          </div>
        </div>

        {/* Card de Membros Efetivos */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaUsers className="text-blue-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-blue-800">
                Membros Efetivos
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.membrosEfetivos.ativos}
              </p>
              <p className="text-sm text-blue-600">
                ativos de {stats.membrosEfetivos.total} total
              </p>
            </div>
          </div>
        </div>

        {/* Card de Aniversariantes */}
        <div className="bg-green-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaBirthdayCake className="text-green-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-green-800">
                Aniversariantes
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.aniversariantes}
              </p>
              <p className="text-sm text-green-600">este mês</p>
            </div>
          </div>
        </div>

        {/* Card de Eventos */}
        <div className="bg-purple-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaCalendarWeek className="text-purple-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-purple-800">
                Eventos da Semana
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.eventosSemana}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumo Financeiro */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Resumo do Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Dízimos</span>
              <span className="font-bold">
                R$ {stats.totalDizimos.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Eventos Próximos</span>
              <span className="font-bold">{stats.eventosSemana}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Novos Membros</span>
              <span className="font-bold">{stats.aniversariantes}</span>
            </div>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Informações</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              Data:{" "}
              {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <p className="text-gray-600">
              Atualizado: {format(new Date(), "HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ProtectedLayout(SecretaryDashboard, {
  allowedRoles: ["secretary"],
});
