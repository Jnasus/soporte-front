import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../../../models/solicitud.model';
import { AuthService } from '../../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private apiUrl = 'http://localhost:8080/api/v1/solicitudes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, solicitud, { headers: this.getAuthHeaders() });
  }

  update(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/${solicitud.id}`, solicitud, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Obtener solicitudes por cliente_id
  getByClienteId(clienteId: number): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers: this.getAuthHeaders() });
  }

  // Obtener solicitudes del usuario autenticado
  // El backend filtrará automáticamente según el rol del usuario
  getMySolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Crear solicitud con cliente_id automático para clientes
  createWithAutoClienteId(solicitud: Partial<Solicitud>): Observable<Solicitud> {
    const userRole = this.authService.getUserRole();
    const accountId = this.authService.getAccountId();
    
    if (userRole === 'CLIENTE' && accountId) {
      // Para clientes, asignar automáticamente su cliente_id
      const solicitudWithClienteId = {
        ...solicitud,
        clienteId: accountId
      };
      return this.create(solicitudWithClienteId as Solicitud);
    } else {
      // Para admins, usar el cliente_id proporcionado
      return this.create(solicitud as Solicitud);
    }
  }
} 