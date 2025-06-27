import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  areaDepartamento: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/v1/clientes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  deleteCliente(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createCliente(cliente: Omit<Cliente, 'id'>) {
    return this.http.post<Cliente>(this.apiUrl, cliente, { headers: this.getAuthHeaders() });
  }

  updateCliente(id: number, cliente: Omit<Cliente, 'id'>) {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, { headers: this.getAuthHeaders() });
  }
} 