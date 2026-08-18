import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EstatisticaDiariaResponse, EstatisticaSemanalResponse,EstatisticaPeriodoResponse } from '../models/estatisticas.model';

@Injectable({
  providedIn: 'root'
})
export class EstatisticaService {
  private readonly apiUrl = 'http://localhost:8080/monitor-estudos/estatisticas';

  constructor(private http: HttpClient) {}

  obterEstatisticaDiaria(data?:string): Observable<EstatisticaDiariaResponse> {
    let params = new HttpParams();
    if (data) {
      params = params.set('data', data);
    }
    return this.http.get<EstatisticaDiariaResponse>(`${this.apiUrl}/diaria`,{params});
  }

  obterEstatisticaSemanal(data?:string) : Observable<EstatisticaSemanalResponse> {
    let params = new HttpParams();
    if (data) {
      params = params.set('data', data);
    }
    return this.http.get<EstatisticaSemanalResponse>(`${this.apiUrl}/semanal`,{params})
  }

  obterEstatisticaPeriodo(inicio:string, fim?:string) : Observable<EstatisticaPeriodoResponse> {
    let params = new HttpParams();
    params = params.set('inicio', inicio)
    if (fim) {
      params = params.set('fim', fim);
    }
    return this.http.get<EstatisticaPeriodoResponse>(`${this.apiUrl}/periodo`,{params})
  }
}