import AdminLayout from "../../components/AdminLayout";
import { ProtectedLayout } from "../../components/ProtectedLayout";

function SecretaryPage() {
  return (
    <AdminLayout title="Painel da Secretaria" role="secretary">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card - Membros Ativos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Membros Ativos</h3>
          <p className="text-3xl font-bold text-blue-600">120</p>
        </div>

        {/* Card - Aniversariantes do Mês */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Aniversariantes</h3>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>

        {/* Card - Eventos da Semana */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Eventos da Semana</h3>
          <p className="text-3xl font-bold text-purple-600">2</p>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Tarefas Pendentes</h3>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Atualizar lista de membros</span>
          </li>
          <li className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Preparar relatório mensal</span>
          </li>
        </ul>
      </div>
    </AdminLayout>
  );
}

export default ProtectedLayout(SecretaryPage, {
  allowedRoles: ["secretary", "admin"],
});
