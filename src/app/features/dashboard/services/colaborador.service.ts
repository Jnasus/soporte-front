import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Colaborador {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  especialidad: string;
  ratingPromedio: number;
  ticketsResueltos: number;
}

@Injectable({ providedIn: 'root' })
export class ColaboradorService {
  private apiUrl = 'http://localhost:8080/api/v1/colaboradores';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getColaboradores(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getColaboradorById(id: number): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createColaborador(colaborador: Omit<Colaborador, 'id'>) {
    return this.http.post<Colaborador>(this.apiUrl, colaborador, { headers: this.getAuthHeaders() });
  }

  updateColaborador(id: number, colaborador: Omit<Colaborador, 'id'>) {
    return this.http.put<Colaborador>(`${this.apiUrl}/${id}`, colaborador, { headers: this.getAuthHeaders() });
  }

  deleteColaborador(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
} 