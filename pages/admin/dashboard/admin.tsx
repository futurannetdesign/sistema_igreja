import { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ProtectedLayout } from "../../../components/ProtectedLayout";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FaUsers,
  FaChurch,
  FaHandHoldingUsd,
  FaCalendarAlt,
} from "react-icons/fa";

interface DashboardStats {
  totalMembros: number;
  totalDizimos: number;
  totalEventos: number;
  totalUsuarios: number;
  eventosPendentes: number;
  dizimosRecentes: number;
  membrosPorMes: number;
  eventosHoje: number;
  totalMembrosEfetivos: number;
  membrosEfetivosAtivos: number;
  membrosEfetivosInativos: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembros: 0,
    totalDizimos: 0,
    totalEventos: 0,
    totalUsuarios: 0,
    eventosPendentes: 0,
    dizimosRecentes: 0,
    membrosPorMes: 0,
    eventosHoje: 0,
    totalMembrosEfetivos: 0,
    membrosEfetivosAtivos: 0,
    membrosEfetivosInativos: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar total de membros
      const { count: membrosCount } = await supabase
        .from("membros")
        .select("*", { count: "exact" });

      // Buscar total de dízimos
      const { data: dizimos } = await supabase.from("dizimos").select("valor");
      const totalDizimos = dizimos?.reduce(
        (acc, curr) => acc + Number(curr.valor),
        0
      );

      // Buscar eventos pendentes
      const { data: eventosPendentes } = await supabase
        .from("eventos")
        .select("*")
        .eq("status", "pendente");

      // Buscar eventos de hoje
      const hoje = new Date().toISOString().split("T")[0];
      const { data: eventosHoje } = await supabase
        .from("eventos")
        .select("*")
        .gte("data_inicio", hoje)
        .lt("data_inicio", hoje + "T23:59:59");

      // Buscar total de usuários
      const { count: usuariosCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact" });

      // Buscar membros efetivos
      const { data: membrosEfetivos } = await supabase
        .from("membros_efetivos")
        .select("*");

      const membrosEfetivosAtivos =
        membrosEfetivos?.filter((m) => m.status === "ativo").length || 0;
      const membrosEfetivosInativos =
        membrosEfetivos?.filter((m) => m.status === "inativo").length || 0;

      setStats({
        totalMembros: membrosCount || 0,
        totalDizimos: totalDizimos || 0,
        totalEventos: eventosPendentes?.length || 0,
        totalUsuarios: usuariosCount || 0,
        eventosPendentes: eventosPendentes?.length || 0,
        dizimosRecentes: dizimos?.length || 0,
        membrosPorMes: membrosCount || 0,
        eventosHoje: eventosHoje?.length || 0,
        totalMembrosEfetivos: membrosEfetivos?.length || 0,
        membrosEfetivosAtivos,
        membrosEfetivosInativos,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  return (
    <AdminLayout title="Dashboard Administrativo" role="admin">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Cards principais */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaUsers className="text-blue-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-blue-800">Membros</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalMembros}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaHandHoldingUsd className="text-green-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-green-800">Dízimos</h3>
              <p className="text-3xl font-bold text-green-600">
                R$ {stats.totalDizimos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaCalendarAlt className="text-purple-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-purple-800">
                Eventos Pendentes
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.eventosPendentes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaChurch className="text-yellow-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-yellow-800">
                Eventos de Hoje
              </h3>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.eventosHoje}
              </p>
            </div>
          </div>
        </div>

        {/* Novo card para Membros Efetivos */}
        <div className="bg-indigo-100 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaUsers className="text-indigo-500 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-bold text-indigo-800">
                Membros Efetivos
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.totalMembrosEfetivos}
              </p>
              <div className="mt-1 text-sm">
                <span className="text-green-600">
                  {stats.membrosEfetivosAtivos} ativos
                </span>{" "}
                /{" "}
                <span className="text-red-600">
                  {stats.membrosEfetivosInativos} inativos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Atividades Recentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Resumo do Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Usuários</span>
              <span className="font-bold">{stats.totalUsuarios}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dízimos Recentes</span>
              <span className="font-bold">{stats.dizimosRecentes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Novos Membros (Mês)</span>
              <span className="font-bold">{stats.membrosPorMes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Eventos Pendentes</span>
              <span className="font-bold">{stats.eventosPendentes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Membros Efetivos</span>
              <div>
                <span className="font-bold">{stats.totalMembrosEfetivos}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({stats.membrosEfetivosAtivos} ativos)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Informações do Sistema</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              Data atual:{" "}
              {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <p className="text-gray-600">
              Última atualização:{" "}
              {format(new Date(), "HH:mm:ss", { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ProtectedLayout(AdminDashboard, { allowedRoles: ["admin"] });
