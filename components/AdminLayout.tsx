import { useRouter } from "next/router";
import { signOut } from "../utils/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  role: "admin" | "pastor" | "secretary";
}

export default function AdminLayout({
  children,
  title,
  role,
}: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg h-screen">
          <nav className="mt-5">
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Dashboard
            </a>
            {role === "admin" && (
              <>
                <a
                  href="/admin/membros"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Membros
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Usuários
                </a>
              </>
            )}
            {(role === "admin" || role === "secretary") && (
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Dízimos
              </a>
            )}
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Eventos
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
