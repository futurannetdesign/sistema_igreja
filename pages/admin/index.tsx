import ProtectedLayout from "../../components/ProtectedLayout";

export default function AdminPage() {
  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>
        {/* Conteúdo do painel */}
      </div>
    </ProtectedLayout>
  );
}
