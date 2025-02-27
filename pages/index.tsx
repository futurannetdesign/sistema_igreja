import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Sistema Igreja</h1>
        <div className="space-y-4">
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
