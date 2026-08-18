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

export interface MateriaTempoResponse{
  materiaId: number,
  materiaTitulo: string,
  tempoAcumuladoMinutos: number,
  materiaCorHex: string
}

export interface EstatisticaPeriodoResponse {
  dataInicio: string;    
  dataFim: string | null;
  tempoTotalMinutos: number;
  quantidadeSessoes: number;
  materias: MateriaTempoResponse[]; 
}

export interface DiaSemanaResponse {
  data: string;    
  diaSemana: string;
  tempoTotalMinutos: number;
  materias: MateriaTempoResponse[]; 
}

export interface EstatisticaSemanalResponse {
  dataInicio: string;    
  dataFim: string;
  tempoTotalMinutos: number;
  dias: DiaSemanaResponse[]; 
}
