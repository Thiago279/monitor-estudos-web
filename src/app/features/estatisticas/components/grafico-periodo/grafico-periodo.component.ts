import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption, BarSeriesOption, PieSeriesOption } from 'echarts';
import { MateriaTempoResponse } from '../../models/estatisticas.model';

@Component({
  selector: 'app-grafico-periodo',
  imports: [NgxEchartsDirective, CommonModule],
  templateUrl: './grafico-periodo.component.html',
  styleUrl: './grafico-periodo.component.css'
})
export class GraficoPeriodoComponent implements OnChanges {
  @Input() materias: MateriaTempoResponse[] = [];

  tipoGrafico: 'barras' | 'pizza' = 'barras';
  chartOptions: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['materias']) {
      this.atualizarGrafico();
    }
  }

  alternarTipo(tipo: 'barras' | 'pizza'): void {
    if (this.tipoGrafico === tipo) return;
    this.tipoGrafico = tipo;
    this.atualizarGrafico();
  }

  private atualizarGrafico(): void {
    if (!this.materias || this.materias.length === 0) {
      this.chartOptions = {};
      return;
    }

    if (this.tipoGrafico === 'barras') {
      this.gerarOpcoesBarras();
    } else {
      this.gerarOpcoesPizza();
    }
  }

  private gerarOpcoesBarras(): void {
    const ordenadas = [...this.materias].sort(
      (a, b) => b.tempoAcumuladoMinutos - a.tempoAcumuladoMinutos
    );

    const titulos = ordenadas.map(m => m.materiaTitulo);
    const seriesData = ordenadas.map(m => ({
      value: m.tempoAcumuladoMinutos,
      itemStyle: {
        color: m.materiaCorHex,
        borderRadius: [0, 6, 6, 0] as [number, number, number, number]
      }
    }));

    const seriesBar: BarSeriesOption = {
      name: 'Tempo Estudado',
      type: 'bar',
      barMaxWidth: 48,
      barCategoryGap: '5%',
      data: seriesData
    };

    this.chartOptions = {
      title: {
        text: 'Tempo por Matéria (Ranking)',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const item = params[0];
          const minutos = Number(item.value);
          const h = Math.floor(minutos / 60);
          const m = minutos % 60;
          const duracao = h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}` : `${m}min`;
          return `<strong>${item.name}</strong><br/>Tempo: ${duracao}`;
        }
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Minutos'
      },
      yAxis: {
        type: 'category',
        data: titulos,
        inverse: true
      },
      series: [seriesBar]
    };
  }

  private gerarOpcoesPizza(): void {
    const seriesPie: PieSeriesOption = {
      name: 'Tempo Estudado',
      type: 'pie',
      radius: ['45%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          formatter: '{b}\n{d}%'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      data: this.materias.map(m => ({
        value: m.tempoAcumuladoMinutos,
        name: m.materiaTitulo,
        itemStyle: { color: m.materiaCorHex }
      }))
    };

    this.chartOptions = {
      title: {
        text: 'Distribuição Percentual por Matéria',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const minutos = Number(params.value);
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
      series: [seriesPie]
    };
  }
}