import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // 
import { Materia } from '../models/materia.model';
@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  apiUrl = 'http://localhost:8080/monitor-estudos/materias';

  constructor(private http: HttpClient) { }

  obterTodas(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  adicionarMateria(materia: Omit<Materia, 'id'>): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  deletarMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  atualizarMateria(id: number, materia: Omit<Materia, 'id'>):Observable<Materia>{
    return this.http.put<Materia>(`${this.apiUrl}/${id}`, materia);
  }
}
