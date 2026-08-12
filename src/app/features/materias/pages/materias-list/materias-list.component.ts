import { Component } from '@angular/core';
import { MateriaService } from '../../services/materia.service';
import { Materia } from '../../models/materia.model'; 
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-materias-list',
  imports: [ReactiveFormsModule],
  templateUrl: './materias-list.component.html',
  styleUrl: './materias-list.component.css'
})
export class MateriasListComponent {
  constructor(private materiaService: MateriaService) { }
  materias: Materia[] = [];

  carregando: boolean = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null

  // Armazena a ID da matéria em edição (null = modo de criação)
  materiaEditandoId: number | null = null;

  materiaForm: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cor: new FormControl('')
  });

  ngOnInit(): void {
    this.iniciarRequisicao();

    this.materiaService.obterTodas().subscribe({
      next: (dados) => {
        this.carregando = false;
        this.materias = dados;
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar a lista de matérias. Verifique a conexão com o servidor.';
        console.error('Erro ao buscar matérias:', erro);
      }
    });
  }

  // Prepara o formulário para modo de edição
  prepararEdicao(materia: Materia): void {
    this.materiaEditandoId = materia.id;
    this.materiaForm.patchValue({
      titulo: materia.titulo,
      cor: materia.cor
    });
  }

  cancelarEdicao(): void {
    this.materiaEditandoId = null;
    this.materiaForm.reset();
  }

  salvar(): void {
    if (this.materiaForm.invalid) return;

    if (this.materiaEditandoId) {
      this.atualizar();
    } else {
      this.cadastrar();
    }
  }

  private cadastrar(): void {
    this.iniciarRequisicao();
    this.materiaService.adicionarMateria(this.materiaForm.value).subscribe({
      next: (novaMateria) => {
        this.carregando = false;
        this.materias.push(novaMateria);
        this.materiaForm.reset();
        this.mensagemSucesso = 'Matéria adicionada com sucesso!';
      },
      error: (erro) => this.tratarErro('Erro ao adicionar matéria.', erro)
    });
  }

  private atualizar(): void {
    if (!this.materiaEditandoId) return;

    this.iniciarRequisicao();
    this.materiaService.atualizarMateria(this.materiaEditandoId, this.materiaForm.value).subscribe({
      next: (materiaAtualizada) => {
        this.carregando = false;
        
        // Substitui o item atualizado no array local em memória
        const index = this.materias.findIndex(m => m.id === this.materiaEditandoId);
        if (index !== -1) {
          this.materias[index] = materiaAtualizada;
        }

        this.mensagemSucesso = 'Matéria atualizada com sucesso!';
        this.cancelarEdicao(); // Limpa e volta pro modo criação
      },
      error: (erro) => this.tratarErro('Erro ao atualizar matéria.', erro)
    });
  }

  deletar(id: number): void{
    this.iniciarRequisicao();

    this.materiaService.deletarMateria(id).subscribe({
      next: () => {
        this.carregando = false;
        this.materias = this.materias.filter(materia => materia.id !== id);
        this.mensagemSucesso = 'Matéria deletada com sucesso!'; 
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = 'Erro ao deletar matéria. Tente novamente.'; 
        console.error('Erro ao deletar matéria:', erro);
      }
    });
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
