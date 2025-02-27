import { withAuth } from '../../components/Auth';

function PastorPage() {
  return (
    <div>
      <h1>Página do Pastor</h1>
      {/* Conteúdo da página */}
    </div>
  );
}

export default withAuth(PastorPage, ['admin', 'pastor']);