import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  email: string;
  role: 'ADMIN' | 'COLABORADOR' | 'CLIENTE';
  password?: string | null;
  colaboradorId: number | null;
  clienteId: number | null;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/v1/usuarios';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUsuario(usuario: Omit<Usuario, 'id'>) {
    return this.http.post<Usuario>(this.apiUrl, usuario, { headers: this.getAuthHeaders() });
  }

  updateUsuario(id: number, usuario: Omit<Usuario, 'id'>) {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario, { headers: this.getAuthHeaders() });
  }

  deleteUsuario(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
} 