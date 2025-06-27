import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud } from '../../../../models/solicitud.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitudes-listar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-3">
      <h2>Solicitudes</h2>
      <div *ngIf="loading" class="alert alert-info">Cargando...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
      <table class="table table-striped" *ngIf="solicitudes.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Cliente</th>
            <th>Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let solicitud of solicitudes">
            <td>{{ solicitud.id }}</td>
            <td>{{ solicitud.titulo }}</td>
            <td>{{ solicitud.estado }}</td>
            <td>{{ solicitud.prioridad }}</td>
            <td>{{ solicitud.clienteNombre }}</td>
            <td>{{ solicitud.fechaCreacion | date:'short' }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1">Editar</button>
              <button class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!solicitudes.length && !loading" class="alert alert-warning">No hay solicitudes registradas.</div>
    </div>
  `
})
export class SolicitudesListarComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  loading = false;
  error = '';

  constructor(private solicitudService: SolicitudService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.loading = true;
    this.solicitudService.getAll().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar solicitudes';
        this.loading = false;
      }
    });
  }
} 