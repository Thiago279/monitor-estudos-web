import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MateriaTempoResponse } from '../../models/estatisticas.model';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafico-periodo',
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './grafico-periodo.component.html',
  styleUrl: './grafico-periodo.component.css'
})
export class GraficoPeriodoComponent implements OnChanges {
  @Input() materias: MateriaTempoResponse[] = [];
  
  tipoGrafico: 'barras' | 'pizza' = 'barras';
  chartOptions: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['materias'] && this.materias.length > 0) {
      this.atualizarGrafico();
    }
  }

  alternarTipo(tipo: 'barras' | 'pizza'): void {
    if (this.tipoGrafico === tipo) return;
    this.tipoGrafico = tipo;
    this.atualizarGrafico();
  }

  private atualizarGrafico(): void {
    if (this.tipoGrafico === 'barras') {
      this.gerarOpcoesBarras();
    } else {
      this.gerarOpcoesPizza();
    }
  }

  private gerarOpcoesBarras(): void {
    // Ordena do maior para o menor tempo estudado
    const ordenadas = [...this.materias].sort(
      (a, b) => b.tempoAcumuladoMinutos - a.tempoAcumuladoMinutos
    );

    // Cada matéria vira uma série independente com a sua própria cor
    const seriesConfig: any[] = ordenadas.map(m => ({
      name: m.materiaTitulo,
      type: 'bar',
      barMaxWidth: 30,
      itemStyle: {
        color: m.materiaCorHex || '#42A5F5',
        borderRadius: [0, 6, 6, 0]
      },
      // Array com o valor correspondente à categoria única do eixo Y
      data: [m.tempoAcumuladoMinutos]
    }));

    this.chartOptions = {
      title: {
        text: 'Tempo por Matéria (Ranking)',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          let texto = '';
          params.forEach((item: any) => {
            if (item.value > 0) {
              const h = Math.floor(item.value / 60);
              const m = item.value % 60;
              const duracao = h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}` : `${m}min`;
              texto += `${item.marker} <strong>${item.seriesName}</strong>: ${duracao}<br/>`;
            }
          });
          return texto || '<em>Nenhuma matéria visível</em>';
        }
      },
      legend: {
        bottom: 0,
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '12%', // Espaço reservado para a legenda interativa
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Minutos'
      },
      yAxis: {
        type: 'category',
        data: ['Matérias'], // Categoria base compartilhada
        show: false // Oculta o label genérico 'Matérias' para focar na legenda e barras
      },
      series: seriesConfig
    };
  }

  private gerarOpcoesPizza(): void {
    this.chartOptions = {
      title: {
        text: 'Distribuição Percentual por Matéria',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const minutos = params.value;
          const h = Math.floor(minutos / 60);
          const m = minutos % 60;
          const duracao = h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}` : `${m}min`;
          return `<strong>${params.name}</strong><br/>Tempo: ${duracao} (${params.percent}%)`;
        }
      },
      legend: {
        bottom: 0,
        type: 'scroll'
      },
      series: [
        {
          name: 'Tempo Estudado',
          type: 'pie',
          radius: '55%',
          data: this.materias.map(m => ({
            value: m.tempoAcumuladoMinutos,
            name: m.materiaTitulo,
            itemStyle: { color: m.materiaCorHex || '#42A5F5' }
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
}