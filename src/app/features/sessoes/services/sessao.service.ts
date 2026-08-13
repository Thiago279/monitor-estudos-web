import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessaoEstudoResponse, SessaoEstudoRequest } from '../models/sessao.model';

@Injectable({
  providedIn: 'root'
})
export class SessaoEstudoService {
  private readonly apiUrl = 'http://localhost:8080/monitor-estudos/sessoes';

  constructor(private http: HttpClient) { }

  obterTodas(): Observable<SessaoEstudoResponse[]> {
    return this.http.get<SessaoEstudoResponse[]>(this.apiUrl);
  }

  iniciarSessao(request: SessaoEstudoRequest): Observable<SessaoEstudoResponse> {
    return this.http.post<SessaoEstudoResponse>(this.apiUrl, request);
  }

  finalizarSessao(id: number, request: SessaoEstudoRequest): Observable<SessaoEstudoResponse> {
    return this.http.put<SessaoEstudoResponse>(`${this.apiUrl}/${id}`, request);
  }
}