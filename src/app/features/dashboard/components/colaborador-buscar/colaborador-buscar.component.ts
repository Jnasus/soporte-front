import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColaboradorService, Colaborador } from '../../services/colaborador.service';

@Component({
  selector: 'app-colaborador-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="colaborador-buscar-container">
      <h2 class="mb-4 text-success"><i class="fas fa-search me-2"></i>Buscar Colaborador por ID</h2>
      <form (ngSubmit)="buscarPorId()" class="row g-2 align-items-center mb-4">
        <div class="col-auto">
          <input type="number" [(ngModel)]="busquedaId" name="busquedaId" class="form-control" placeholder="Ingrese ID de colaborador" required />
        </div>
        <div class="col-auto">
          <button type="submit" class="btn btn-success"><i class="fas fa-search"></i> Buscar</button>
        </div>
        <div class="col-auto" *ngIf="busquedaId">
          <button type="button" class="btn btn-outline-secondary" (click)="limpiarBusqueda()"><i class="fas fa-times"></i> Limpiar</button>
        </div>
      </form>
      <div *ngIf="colaboradorEncontrado">
        <table class="table table-hover table-bordered rounded-3 overflow-hidden shadow-sm">
          <thead class="table-success text-dark">
            <tr>
              <th>ID</th><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Especialidad</th><th>Rating</th><th>Tickets Resueltos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ colaboradorEncontrado.id }}</td>
              <td>{{ colaboradorEncontrado.nombre }}</td>
              <td>{{ colaboradorEncontrado.apellido }}</td>
              <td>{{ colaboradorEncontrado.telefono }}</td>
              <td>{{ colaboradorEncontrado.especialidad }}</td>
              <td>{{ colaboradorEncontrado.ratingPromedio }}</td>
              <td>{{ colaboradorEncontrado.ticketsResueltos }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  `,
  styles: [`
    .colaborador-buscar-container { padding: 2rem; }
    h2 { margin-bottom: 1rem; }
    .table { background: #fff; }
    .table th, .table td { vertical-align: middle; }
  `]
})
export class ColaboradorBuscarComponent {
  busquedaId: number | null = null;
  colaboradorEncontrado: Colaborador | null = null;
  error: string = '';

  constructor(private colaboradorService: ColaboradorService) {}

  buscarPorId() {
    if (!this.busquedaId) return;
    this.error = '';
    this.colaboradorService.getColaboradorById(this.busquedaId).subscribe({
      next: (data) => { this.colaboradorEncontrado = data; },
      error: () => { this.error = 'Colaborador no encontrado.'; this.colaboradorEncontrado = null; }
    });
  }

  limpiarBusqueda() {
    this.busquedaId = null;
    this.colaboradorEncontrado = null;
    this.error = '';
  }
} 