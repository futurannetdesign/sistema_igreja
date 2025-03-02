import Image from "next/image";

export default function TestImage() {
  return (
    <div className="p-4">
      <h1>Teste de Imagem</h1>
      <div className="border p-4 my-4">
        <h2>Imagem SVG</h2>
        <Image
          src="/images/logo.svg"
          alt="Logo Test"
          width={100}
          height={100}
          onError={(e) => {
            console.error("Erro ao carregar imagem:", e);
          }}
        />
      </div>
      <pre className="bg-gray-100 p-4 mt-4">
        {`Caminho da imagem: ${process.cwd()}/public/images/logo.svg`}
      </pre>
    </div>
  );
}
