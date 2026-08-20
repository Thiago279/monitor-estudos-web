import { Component } from '@angular/core';
import { EstatisticaService } from '../../services/estatisticas.service';
import { EstatisticaDiariaResponse, EstatisticaSemanalResponse, EstatisticaPeriodoResponse} from '../../models/estatisticas.model';
import { GraficoSemanalComponent } from '../../components/grafico-semanal/grafico-semanal.component';
import { TimelineDiariaComponent } from '../../components/timeline-diaria/timeline-diaria.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GraficoPeriodoComponent } from '../../components/grafico-periodo/grafico-periodo.component';

@Component({
  selector: 'app-estatisticas',
  imports: [FormsModule, CommonModule, GraficoSemanalComponent, GraficoPeriodoComponent, TimelineDiariaComponent],
  templateUrl: './estatisticas.component.html',
  styleUrl: './estatisticas.component.css'
})
export class EstatisticasComponent {

  constructor(
    private estatisticaService: EstatisticaService,
  ){}

  dataInicio: string = '';
  dataFim: string = '';
  carregando: boolean = false;

  estatisticaDiaria:EstatisticaDiariaResponse | null = null;
  estatisticaSemanal: EstatisticaSemanalResponse | null = null;
  estatisticaPeriodo: EstatisticaPeriodoResponse | null = null;

  tipoVisualizacao: 'DIARIA' | 'SEMANAL' | 'PERIODO' = 'DIARIA';

  dataDiariaSelecionada: string = '';

  mensagemErro: string | null = null;

  
  ngOnInit(): void {
    this.carregarEstatisticaDiaria();
  }

  carregarEstatisticaDiaria(): void {
    this.iniciarRequisicao();

    this.estatisticaService.obterEstatisticaDiaria(this.dataDiariaSelecionada || undefined).subscribe({
      next: (dados) => {
        this.carregando = false;
        this.estatisticaDiaria = dados;
      },
      error: (erro) => {
        this.mensagemErro = 'Não foi possível carregar a estatística diária. Verifique a conexão com o servidor.';
        this.tratarErro(this.mensagemErro, erro);
      }
    });
  }

  carregarEstatisticaSemanal(): void {
    this.iniciarRequisicao();

    this.estatisticaService.obterEstatisticaSemanal().subscribe({
      next: (dados) => {
        this.carregando = false;
        this.estatisticaSemanal = dados;
      },
      error: (erro) => {
        this.tratarErro('Não foi possível carregar a estatística semanal. Verifique a conexão com o servidor.', erro);
      }
    });
  }

  carregarEstatisticaPeriodo(): void {
    if (!this.dataInicio) {
      this.mensagemErro = 'Informe a data de início para buscar a estatística do período.';
      return;
    }

    if(this.dataFim && this.dataFim < this.dataInicio) {
      this.mensagemErro = 'A data de fim não pode ser anterior à data de início.';
      return;
    }

    this.iniciarRequisicao();

    this.estatisticaService.obterEstatisticaPeriodo(this.dataInicio, this.dataFim || undefined).subscribe({
      next: (dados) => {
        this.carregando = false;
        this.estatisticaPeriodo = dados;
      },
      error: (erro) => {
        this.tratarErro(
          'Não foi possível carregar a estatística do período. Verifique a conexão com o servidor.',
          erro
        );
      }
    });
  }

  trocarVisualizacao(tipo: 'DIARIA' | 'SEMANAL' | 'PERIODO'): void {
  this.tipoVisualizacao = tipo;
  if (tipo === 'DIARIA' && !this.estatisticaDiaria) {
    this.carregarEstatisticaDiaria();
  } else if (tipo === 'SEMANAL' && !this.estatisticaSemanal) {
    this.carregarEstatisticaSemanal();
  }
}

  formatarDuracao(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;

    if (horas === 0) {
      return `${minutosRestantes} min`;
    }

    if (minutosRestantes === 0) {
      return `${horas}h`;
    }

    return `${horas}h ${minutosRestantes}min`;
  }

  private iniciarRequisicao(): void {
    this.carregando = true;
    this.mensagemErro = null;
  }

  private tratarErro(mensagem: string, erro: unknown): void {
    this.carregando = false;
    this.mensagemErro = mensagem;
    console.error(erro);
  }

}
