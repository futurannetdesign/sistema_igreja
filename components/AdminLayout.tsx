import { useRouter } from "next/router";
import Link from "next/link";
import { signOut } from "../utils/auth";
import { useState } from "react";
import Footer from "./Footer";
import Image from "next/image";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getDashboardPath = () => {
    switch (role) {
      case "admin":
        return "/admin/dashboard/admin";
      case "pastor":
        return "/admin/dashboard/pastor";
      case "secretary":
        return "/admin/dashboard/secretary";
      default:
        return "/admin/dashboard";
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  // Adicionar função de tratamento de erro
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    location: string
  ) => {
    console.error(`Erro ao carregar logo (${location}):`, e);
    console.log("Caminho da imagem:", "/images/logo.svg");
    e.currentTarget.style.display = "none";
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {" "}
      {/* Added pb-16 for footer space */}
      {/* Navbar Responsiva */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Botão Menu Mobile */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>

              {/* Logo atualizada para SVG */}
              <div className="flex-shrink-0 flex items-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                    className="object-contain"
                    onError={(e) => handleImageError(e, "navbar")}
                  />
                </div>
                <h1 className="text-xl font-bold ml-2">{title}</h1>
              </div>
            </div>

            {/* Botões da Navbar */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1.5 text-sm md:px-4 md:py-2 rounded hover:bg-red-600 shadow-md"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Sidebar Responsiva */}
      <div className="flex pt-16">
        <aside
          className={`
            fixed left-0 z-40 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out
            w-64 transform md:translate-x-0 md:static
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Overlay para mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Logo SVG na sidebar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative w-12 h-12 mx-auto">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={48}
                height={48}
                priority
                className="object-contain"
                onError={(e) => handleImageError(e, "sidebar")}
              />
            </div>
          </div>

          <nav className="mt-5 space-y-1 px-2">
            <Link
              href={getDashboardPath()}
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
            >
              Dashboard
            </Link>

            {/* Links comuns para todos os papéis */}
            <Link
              href="/admin/membros-efetivos"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
            >
              Membros Efetivos
            </Link>

            {/* Links específicos para admin */}
            {role === "admin" && (
              <>
                <Link
                  href="/admin/membros"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Membros
                </Link>
                <Link
                  href="/admin/usuarios"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Usuários
                </Link>
                <Link
                  href="/admin/dizimos"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Dízimos
                </Link>
                <Link
                  href="/admin/eventos"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Eventos
                </Link>
              </>
            )}

            {/* Links para secretária */}
            {role === "secretary" && (
              <>
                <Link
                  href="/admin/membros"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Membros
                </Link>
                <Link
                  href="/admin/dizimos"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Dízimos
                </Link>
                <Link
                  href="/admin/eventos"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Eventos
                </Link>
              </>
            )}

            {/* Links para pastor */}
            {role === "pastor" && (
              <>
                <Link
                  href="/admin/membros"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Membros
                </Link>
                <Link
                  href="/admin/eventos"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Eventos
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Conteúdo Principal Responsivo */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
