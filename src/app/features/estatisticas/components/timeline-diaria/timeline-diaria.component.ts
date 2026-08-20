import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessaoResumoResponse } from '../../models/estatisticas.model';

export interface SegmentoGrafico {
  titulo: string;
  corHex: string;
  leftPercentual: number;
  widthPercentual: number;
  tooltip: string;
}

export interface LinhaHora {
  hora: number;
  label: string;
  segmentos: SegmentoGrafico[];
}

@Component({
  selector: 'app-timeline-diaria',
  imports: [CommonModule],
  templateUrl: './timeline-diaria.component.html',
  styleUrl: './timeline-diaria.component.css'
})
export class TimelineDiariaComponent implements OnChanges {
  @Input() sessoes: SessaoResumoResponse[] = [];

  dataDiariaSelecionada: string = new Date().toISOString().split('T')[0];

  // Grade das 05h às 24h (ou 00h a 23h se preferir todas)
  horasDoDia: LinhaHora[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sessoes']) {
      this.montarGradeHoraria();
    }
  }

  

  private montarGradeHoraria(): void {
    const grade: LinhaHora[] = [];
    
    // YPT geralmente mostra das 05h até 24h (24h/00h no fim)
    // Para simplificar e cobrir o dia completo, vamos criar de 0 a 23:
    for (let h = 0; h < 24; h++) {
      const label = `${h.toString().padStart(2, '0')}:00`;
      grade.push({
        hora: h,
        label: label,
        segmentos: this.calcularSegmentosDaHora(h)
      });
    }

    this.horasDoDia = grade;
  }

  private calcularSegmentosDaHora(hora: number): SegmentoGrafico[] {
    if (!this.sessoes || this.sessoes.length === 0) return [];

    const horaInicioMinutos = hora * 60;
    const horaFimMinutos = (hora + 1) * 60;
    const segmentos: SegmentoGrafico[] = [];

    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    for (const sessao of this.sessoes) {
      const sessaoInicio = this.converterHorarioParaMinutos(sessao.horaInicio);
      const sessaoFim = sessao.horaFim 
        ? this.converterHorarioParaMinutos(sessao.horaFim)
        : minutosAgora;

      // Verifica se a sessão se sobrepõe a esta hora
      const inicioEfetivo = Math.max(sessaoInicio, horaInicioMinutos);
      const fimEfetivo = Math.min(sessaoFim, horaFimMinutos);

      if (fimEfetivo > inicioEfetivo) {
        const inicioNaLinha = inicioEfetivo - horaInicioMinutos;
        const duracaoNaLinha = fimEfetivo - inicioEfetivo;

        segmentos.push({
          titulo: sessao.materiaTitulo,
          corHex: sessao.materiaCorHex,
          leftPercentual: (inicioNaLinha / 60) * 100,
          widthPercentual: (duracaoNaLinha / 60) * 100,
          tooltip: `${sessao.materiaTitulo}: ${sessao.horaInicio} - ${sessao.horaFim || 'Em andamento'}`
        });
      }
    }

    return segmentos;
  }

  private converterHorarioParaMinutos(horario: string): number {
    const [horas, minutos] = horario.split(':').map(Number);
    return horas * 60 + minutos;
  }
}