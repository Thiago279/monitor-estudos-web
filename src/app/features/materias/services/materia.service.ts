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

  obterTodas() {
    return this.http.get<Materia[]>(this.apiUrl);
  }
}
