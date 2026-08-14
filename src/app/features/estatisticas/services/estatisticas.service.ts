import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstatisticaDiariaResponse } from '../models/estatisticas.model';

@Injectable({
  providedIn: 'root'
})
export class EstatisticaService {
  private readonly apiUrl = 'http://localhost:8080/monitor-estudos/estatisticas';

  constructor(private http: HttpClient) {}

  obterEstatisticaDiaria(): Observable<EstatisticaDiariaResponse> {
    return this.http.get<EstatisticaDiariaResponse>(`${this.apiUrl}/diaria`);
  }
}