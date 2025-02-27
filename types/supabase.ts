export interface Membro {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  data_batismo?: string;
  cargo?: string;
  created_at: string;
}

export interface Dizimo {
  id: number;
  membro_id: number;
  valor: number;
  data: string;
  tipo: "dizimo" | "oferta";
  created_at: string;
}

export interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  created_at: string;
}
