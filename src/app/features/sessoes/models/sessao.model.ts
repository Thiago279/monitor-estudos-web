// Resposta devolvida pela API (SessaoEstudoResponse)
export interface SessaoEstudoResponse {
  id: number;
  dataInicio: string; // ISO 8601 (Ex: '2026-08-12T14:30:00')
  dataFim: string | null; // Null se estiver EM_ANDAMENTO
  materiaId: number;
  materiaTitulo: string;
}

// Requisição enviada para a API (SessaoEstudoRequest)
export interface SessaoEstudoRequest {
  materiaId: number;
  dataInicio: string;
  dataFim?: string | null;
}