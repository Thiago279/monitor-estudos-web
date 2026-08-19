import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { DiaSemanaResponse } from '../../models/estatisticas.model';

@Component({
  selector: 'app-grafico-semanal',
  imports: [NgxEchartsDirective],
  templateUrl: './grafico-semanal.component.html',
  styleUrl: './grafico-semanal.component.css'
})
export class GraficoSemanalComponent {
  @Input() dias: DiaSemanaResponse[] = [];
  chartOptions: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dias'] && this.dias.length > 0) {
      this.atualizarGrafico();
    }
  }

  private atualizarGrafico(): void {
    // Mapeia os dias abreviados ou os nomes vindos da API
      const nomesAbreviados: Record<string, string> = {
        'SEGUNDA-FEIRA': 'Seg',
        'TERCA-FEIRA': 'Ter',
        'TERÇA-FEIRA': 'Ter',
        'QUARTA-FEIRA': 'Qua',
        'QUINTA-FEIRA': 'Qui',
        'SEXTA-FEIRA': 'Sex',
        'SÁBADO': 'Sáb',
        'DOMINGO': 'Dom'
      };
    const labelsDias = this.dias.map(
      d => nomesAbreviados[d.diaSemana.toUpperCase()] || d.diaSemana
    );

    // 1. Extrai todas as matérias únicas que apareceram na semana
    const mapaMaterias = new Map<number, { titulo: string; corHex: string }>();
    this.dias.forEach(dia => {
      dia.materias.forEach(m => {
        if (!mapaMaterias.has(m.materiaId)) {
          mapaMaterias.set(m.materiaId, {
            titulo: m.materiaTitulo,
            corHex: m.materiaCorHex 
          });
        }
      });
    });

    // 2. Cria uma série empilhada (stack) para cada matéria
    const seriesConfig: any[] = Array.from(mapaMaterias.entries()).map(([materiaId, info]) => {
      const temposPorDia = this.dias.map(dia => {
        const registro = dia.materias.find(m => m.materiaId === materiaId);
        const valor = registro ? registro.tempoAcumuladoMinutos : 0;
        
        if (valor === 0) return 0;

        // Descobre qual é a matéria mais ao topo que tem valor > 0 neste dia específico
        const materiasDoDiaComTempo = dia.materias.filter(m => m.tempoAcumuladoMinutos > 0);
        const ehOTopoDesteDia = materiasDoDiaComTempo[materiasDoDiaComTempo.length - 1]?.materiaId === materiaId;

        return {
          value: valor,
          itemStyle: {
            borderRadius: ehOTopoDesteDia ? [6, 6, 0, 0] : [0, 0, 0, 0]
          }
        };
      });

      return {
        name: info.titulo,
        type: 'bar',
        stack: 'total',
        barMaxWidth: 60,
        barCategoryGap: '2%',
        itemStyle: {
          color: info.corHex
        },
        data: temposPorDia
      };
    });

    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let texto = `<strong>${params[0].name}</strong><br/>`;
          let totalDia = 0;

          params.forEach((item: any) => {
            if (item.value > 0) {
              const h = Math.floor(item.value / 60);
              const m = item.value % 60;
              const duracao = h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}` : `${m}min`;
              texto += `${item.marker} ${item.seriesName}: ${duracao}<br/>`;
              totalDia += item.value;
            }
          });

          if (totalDia > 0) {
            const hTotal = Math.floor(totalDia / 60);
            const mTotal = totalDia % 60;
            const totalFormatado = hTotal > 0 ? `${hTotal}h ${mTotal > 0 ? mTotal + 'min' : ''}` : `${mTotal}min`;
            texto += `<hr style="margin: 4px 0; border: none; border-top: 1px solid #ccc;"/>`;
            texto += `<strong>Total: ${totalFormatado}</strong>`;
          } else {
            texto += '<em>Nenhum estudo registrado</em>';
          }

          return texto;
        }
      },
      legend: {
        bottom: 0,
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%', // Espaço para a legenda das matérias
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labelsDias,
        axisLabel: { interval: 0 }
      },
      yAxis: {
        type: 'value',
        name: 'Minutos'
      },
      series: seriesConfig
    };
  }

}
