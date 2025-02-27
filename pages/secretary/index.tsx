import { withAuth } from "../../components/Auth";

function SecretaryPage() {
  return (
    <div>
      <h1>Página da Secretaria</h1>
      {/* Conteúdo da página */}
    </div>
  );
}

export default withAuth(SecretaryPage, ["admin", "secretary"]);
