import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { CommonModule, DatePipe } from '@angular/common';
import { Materia } from '../../../materias/models/materia.model';
import { SessaoEstudoResponse } from '../../../sessoes/models/sessao.model';
import { interval, Subscription } from 'rxjs';
import { MateriaService } from '../../../materias/services/materia.service';
import { SessaoEstudoService } from '../../../sessoes/services/sessao.service';
import { SessaoEstudoRequest } from '../../../sessoes/models/sessao.model';
import { EstatisticaService } from '../../../estatisticas/services/estatisticas.service';
import { EstatisticaDiariaResponse } from '../../../estatisticas/models/estatisticas.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private materiaService: MateriaService,
    private sessaoEstudoService: SessaoEstudoService,
    private estatisticaService: EstatisticaService
  ) { }

  materias: Materia[] = [];
  materiaControl = new FormControl<number | null>(null, Validators.required);
  emAndamento: SessaoEstudoResponse | null = null
  estatisticaDiaria: EstatisticaDiariaResponse | null = null;

  exibirFormularioIniciar: boolean = false;
  alternarFormulario(): void {
    this.exibirFormularioIniciar = !this.exibirFormularioIniciar;
  }

  cancelarInicio(): void {
    this.exibirFormularioIniciar = false;
    this.materiaControl.reset();
  }
  
  tempoFormatado: string = '00:00:00';
  timerSubscription: Subscription | null = null;
  carregando: boolean = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  private carregarDadosIniciais(): void {
    this.iniciarRequisicao();

    // Busca as Matérias para o dropdown
    this.materiaService.obterTodas().subscribe({
      next: (dadosMaterias) => {
        this.materias = dadosMaterias;
        
        this.verificarSessaoAtiva();

        this.carregarEstatisticaDiaria();
      },
      error: (erro) => this.tratarErro('Erro ao carregar matérias.', erro)
    });
  }

  iniciarNovaSessao(): void {
    if(!this.emAndamento && this.materiaControl.value !== null){
      this.iniciarRequisicao();
      const sessaoNova: SessaoEstudoRequest = {
        materiaId: this.materiaControl.value,
        dataInicio: this.obterDataHoraLocalISO(),
        dataFim: null
      };
      this.sessaoEstudoService.iniciarSessao(sessaoNova).subscribe({
        next: (sessaoCriada) => {
          this.carregando = false;
          this.emAndamento = sessaoCriada;
          this.iniciarTimer(sessaoCriada.dataInicio);
          this.mensagemSucesso = 'Sessão iniciada com sucesso!';
        },
        error: (erro) => this.tratarErro('Erro ao iniciar sessão.', erro)
      });
    }
  }

  finalizarSessao(): void {
    if(this.emAndamento){
      this.iniciarRequisicao();
      this.sessaoEstudoService.finalizarSessao(this.emAndamento.id).subscribe({
        next: (sessaoFinalizada) => {
          this.carregando = false;
          this.emAndamento = null;
          this.pararTimer();
          this.mensagemSucesso = 'Sessão finalizada com sucesso!';
          this.carregarEstatisticaDiaria();
        },
        error: (erro) => this.tratarErro('Erro ao finalizar sessão.', erro)
      });
    }
  }

  private verificarSessaoAtiva(): void {
    this.sessaoEstudoService.obterTodas().subscribe({
      next: (dadosSessoes) => {
        this.carregando = false;
        
        // Encontra a sessão onde dataFim é nulo
        this.emAndamento = dadosSessoes.find(s => s.dataFim === null) || null;

        // SE existir uma sessão ativa, ligamos o cronômetro!
        if (this.emAndamento) {
          this.iniciarTimer(this.emAndamento.dataInicio);
        }
      },
      error: (erro) => this.tratarErro('Erro ao verificar sessão ativa.', erro)
    });
  }

  carregarEstatisticaDiaria(): void {
    this.estatisticaService.obterEstatisticaDiaria().subscribe({
      next: (dados) => {
        this.estatisticaDiaria = dados;
      },
      error: (erro) => console.error('Erro ao carregar estatísticas do dia:', erro)
    });
  }

  private iniciarTimer(dataInicioStr: string): void {
    // 1. Se já houver um timer rodando antes, cancelamos para evitar duplicidade
    this.pararTimer();

    const dataInicio = new Date(dataInicioStr).getTime();

    // 2. Dispara o interval de 1000ms (1 segundo)
    this.timerSubscription = interval(1000).subscribe(() => {
      const agora = new Date().getTime();
      const diferencaEmSegundos = Math.floor((agora - dataInicio) / 1000);

      // Converte segundos totais em string HH:mm:ss
      this.tempoFormatado = this.formatarSegundos(diferencaEmSegundos);
    });
  }

  private pararTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Para o consumo do interval
      this.timerSubscription = null;
    }
    this.tempoFormatado = '00:00:00';
  }

  // Função auxiliar de matemática para formatar segundos em HH:mm:ss
  private formatarSegundos(totalSegundos: number): string {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    const h = String(horas).padStart(2, '0');
    const m = String(minutos).padStart(2, '0');
    const s = String(segundos).padStart(2, '0');

    return `${h}:${m}:${s}`;
  }

  // Gera a string "YYYY-MM-DDTHH:mm:ss" no horário local da máquina
private obterDataHoraLocalISO(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  const segundos = String(agora.getSeconds()).padStart(2, '0');

  return `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
}

  private iniciarRequisicao(): void {
    this.carregando = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;
  }

  private tratarErro(mensagem: string, erro: unknown): void {
    this.carregando = false;
    this.mensagemErro = mensagem;
    console.error(erro);
  }
}
