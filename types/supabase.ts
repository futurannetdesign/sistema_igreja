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

export type Database = {
  public: {
    Tables: {
      membros: {
        Row: {
          id: number;
          nome: string;
          email: string;
          created_at: string;
          // ... outros campos
        };
        Insert: {
          nome: string;
          email: string;
          // ... campos necessários para inserção
        };
        Update: {
          nome?: string;
          email?: string;
          // ... campos que podem ser atualizados
        };
      };
      // ... outras tabelas
    };
  };
};
