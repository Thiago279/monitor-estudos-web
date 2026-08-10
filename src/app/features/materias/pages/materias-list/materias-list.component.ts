import { Component } from '@angular/core';
import { MateriaService } from '../../services/materia.service';
import { Materia } from '../../models/materia.model'; 

@Component({
  selector: 'app-materias-list',
  imports: [],
  templateUrl: './materias-list.component.html',
  styleUrl: './materias-list.component.css'
})
export class MateriasListComponent {
  constructor(private materiaService: MateriaService) { }
  materias: Materia[] = [];
  ngOnInit(): void {
    this.materiaService.obterTodas().subscribe({
      next: (dados) => {
        this.materias = dados;
        console.log('Matérias recebidas:', dados);
      },
      error: (erro) => {
        console.error('Erro ao buscar matérias:', erro);
      }
    });
  }

}
