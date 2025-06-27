import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cliente-buscar-container">
      <h2 class="mb-4 text-success"><i class="fas fa-search me-2"></i>Buscar Cliente por ID</h2>
      <form (ngSubmit)="buscarPorId()" class="row g-2 align-items-center mb-4">
        <div class="col-auto">
          <input type="number" [(ngModel)]="busquedaId" name="busquedaId" class="form-control" placeholder="Ingrese ID de cliente" required />
        </div>
        <div class="col-auto">
          <button type="submit" class="btn btn-success"><i class="fas fa-search"></i> Buscar</button>
        </div>
        <div class="col-auto" *ngIf="busquedaId">
          <button type="button" class="btn btn-outline-secondary" (click)="limpiarBusqueda()"><i class="fas fa-times"></i> Limpiar</button>
        </div>
      </form>
      <div *ngIf="clienteEncontrado">
        <table class="table table-hover table-bordered rounded-3 overflow-hidden shadow-sm">
          <thead class="table-success text-dark">
            <tr>
              <th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Teléfono</th><th>Área/Depto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ clienteEncontrado.id }}</td>
              <td>{{ clienteEncontrado.nombre }}</td>
              <td>{{ clienteEncontrado.apellido }}</td>
              <td>{{ clienteEncontrado.email }}</td>
              <td>{{ clienteEncontrado.telefono }}</td>
              <td>{{ clienteEncontrado.areaDepartamento }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  `,
  styles: [`
    .cliente-buscar-container { padding: 2rem; }
    h2 { margin-bottom: 1rem; }
    .table { background: #fff; }
    .table th, .table td { vertical-align: middle; }
  `]
})
export class ClienteBuscarComponent {
  busquedaId: number | null = null;
  clienteEncontrado: Cliente | null = null;
  error: string = '';

  constructor(private clienteService: ClienteService) {}

  buscarPorId() {
    if (!this.busquedaId) return;
    this.error = '';
    this.clienteService.getClienteById(this.busquedaId).subscribe({
      next: (data) => { this.clienteEncontrado = data; },
      error: () => { this.error = 'Cliente no encontrado.'; this.clienteEncontrado = null; }
    });
  }

  limpiarBusqueda() {
    this.busquedaId = null;
    this.clienteEncontrado = null;
    this.error = '';
  }
} 