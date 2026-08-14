export interface SessaoResumoResponse {
  sessaoId: number;
  materiaId: number;
  materiaTitulo: string;
  materiaCorHex: string;
  horaInicio: string;    // "14:30:00"
  horaFim: string | null;
  duracaoMinutos: number;
  status: 'EM_ANDAMENTO' | 'FINALIZADA';        // "CONCLUIDA" | "EM_ANDAMENTO"
}

export interface EstatisticaDiariaResponse {
  data: string;          // "2026-08-14"
  tempoTotalMinutos: number;
  sessoes: SessaoResumoResponse[];
}