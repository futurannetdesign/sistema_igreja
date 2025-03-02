import AdminLayout from "../../components/AdminLayout";
import { ProtectedLayout } from "../../components/ProtectedLayout";

function PastorPage() {
  return (
    <AdminLayout title="Painel do Pastor" role="pastor">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card - Cultos do Mês */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Cultos do Mês</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>

        {/* Card - Visitas Pastorais */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Visitas Pastorais</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>

        {/* Card - Novos Convertidos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Novos Convertidos</h3>
          <p className="text-3xl font-bold text-purple-600">3</p>
        </div>
      </div>

      {/* Agenda Pastoral */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Agenda Pastoral</h3>
        <div className="space-y-4">
          <div className="border-b pb-2">
            <p className="font-semibold">Hoje</p>
            <ul className="ml-4">
              <li>09:00 - Reunião com diáconos</li>
              <li>15:00 - Visita pastoral</li>
              <li>19:30 - Culto de ensino</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ProtectedLayout(PastorPage, {
  allowedRoles: ["pastor", "admin"],
});
