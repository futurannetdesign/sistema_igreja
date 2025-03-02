import { SystemError } from "./error";

export type EventStatus = "pendente" | "realizado" | "cancelado";
export type EventType = "culto" | "visita" | "conversao" | "agenda" | "todos";

export interface BaseEvent {
  id: string;
  titulo: string;
  data_evento: string;
  status: EventStatus;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventoPastoral extends BaseEvent {
  tipo: EventType;
  descricao?: string;
  pessoa_envolvida?: string;
  local?: string;
  observacoes?: string;
}

export interface EventoResponse {
  data: EventoPastoral[] | null;
  error: SystemError | null;
  count?: number;
}
