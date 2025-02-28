import AdminLayout from "../../components/AdminLayout";
import { ProtectedLayout } from "../../components/ProtectedLayout";

function AdminPage() {
  return (
    <AdminLayout title="Painel do Administrador" role="admin">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card - Total de Membros */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total de Membros</h3>
          <p className="text-3xl font-bold text-blue-600">150</p>
        </div>

        {/* Card - Dízimos do Mês */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Dízimos do Mês</h3>
          <p className="text-3xl font-bold text-green-600">R$ 5.000,00</p>
        </div>

        {/* Card - Eventos Próximos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Eventos Próximos</h3>
          <p className="text-3xl font-bold text-purple-600">3</p>
        </div>
      </div>

      {/* Tabela de Atividades Recentes */}
      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Data</th>
                <th className="text-left py-2">Atividade</th>
                <th className="text-left py-2">Usuário</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">27/02/2024</td>
                <td className="py-2">Novo membro cadastrado</td>
                <td className="py-2">Secretária</td>
              </tr>
              {/* Adicione mais linhas conforme necessário */}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ProtectedLayout(AdminPage, { allowedRoles: ["admin"] });
