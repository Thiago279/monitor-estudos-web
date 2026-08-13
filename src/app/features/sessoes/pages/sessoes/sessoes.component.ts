import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MateriaService } from '../../../materias/services/materia.service';
import { SessaoEstudoService } from '../../services/sessao.service';
import { Materia } from '../../../materias/models/materia.model';
import { SessaoEstudoRequest, SessaoEstudoResponse } from '../../models/sessao.model';

@Component({
  selector: 'app-sessoes',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './sessoes.component.html',
  styleUrl: './sessoes.component.css'
})
export class SessoesComponent implements OnInit {

  sessaoManualForm: FormGroup = new FormGroup({
    materiaId: new FormControl<number | null>(null, [Validators.required]),
    dataInicio: new FormControl<string>('', [Validators.required]),
    dataFim: new FormControl<string>('', [Validators.required])
  });


  materias: Materia[] = [];
  sessoes: SessaoEstudoResponse[] = [];
  emAndamento: SessaoEstudoResponse | null = null;

  // 1. Variáveis de Estado de Requisição
  carregando: boolean = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  constructor(
    private materiaService: MateriaService,
    private sessaoEstudoService: SessaoEstudoService
  ) { }

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  private carregarDadosIniciais(): void {
    this.iniciarRequisicao();

    // Carrega Matérias
    this.materiaService.obterTodas().subscribe({
      next: (dadosMaterias) => {
        this.materias = dadosMaterias;
        
        this.carregarSessoes();
      },
      error: (erro) => this.tratarErro('Não foi possível carregar as matérias. Verifique a API.', erro)
    });
  }

  private carregarSessoes(): void {
    this.sessaoEstudoService.obterTodas().subscribe({
      next: (dadosSessoes) => {
        this.carregando = false;
        this.sessoes = dadosSessoes;
        this.emAndamento = dadosSessoes.find(sessao => sessao.dataFim === null) || null;
      },
      error: (erro) => this.tratarErro('Erro ao carregar histórico de sessões.', erro)
    });
  }

  cadastrarSessaoManual(): void {
    if (this.sessaoManualForm.invalid) return;

    this.iniciarRequisicao();

    // Monta o payload conforme seu SessaoEstudoRequest
    const payload: SessaoEstudoRequest = {
      materiaId: Number(this.sessaoManualForm.value.materiaId),
      dataInicio: this.sessaoManualForm.value.dataInicio,
      dataFim: this.sessaoManualForm.value.dataFim
    };

    this.sessaoEstudoService.iniciarSessao(payload).subscribe({
      next: (novaSessao) => {
        this.carregando = false;
        
        // Adiciona a nova sessão no início do histórico local
        this.sessoes.unshift(novaSessao);
        
        this.sessaoManualForm.reset();
        this.mensagemSucesso = 'Sessão antiga registrada no histórico com sucesso!';
      },
      error: (erro) => this.tratarErro('Erro ao registrar sessão antiga.', erro)
    });
  }
  
  // 2. Métodos Utilitários de Estado (Iguais aos de MateriasListComponent!)
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