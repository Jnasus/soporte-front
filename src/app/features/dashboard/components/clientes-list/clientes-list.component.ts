import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="clientes-list-container">
      <h2 class="mb-4 text-secondary"><i class="fas fa-users me-2"></i>Todos los Clientes</h2>
      <table class="table table-hover table-bordered rounded-3 overflow-hidden shadow-sm">
        <thead class="table-warning text-dark">
          <tr>
            <th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Teléfono</th><th>Área/Depto</th><th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cliente of clientes">
            <td>{{ cliente.id }}</td>
            <td>{{ cliente.nombre }}</td>
            <td>{{ cliente.apellido }}</td>
            <td>{{ cliente.email }}</td>
            <td>{{ cliente.telefono }}</td>
            <td>{{ cliente.areaDepartamento }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" title="Editar" (click)="abrirModalEditar(cliente)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" title="Eliminar" (click)="abrirModal(cliente)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>

      <!-- Modal de confirmación -->
      <div class="modal fade show" tabindex="-1" [ngStyle]="{display: mostrarModal ? 'block' : 'none', background: 'rgba(0,0,0,0.5)'}" *ngIf="mostrarModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title"><i class="fas fa-exclamation-triangle me-2"></i>Confirmar eliminación</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="cerrarModal()"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas eliminar al cliente <strong>{{ clienteAEliminar?.nombre }} {{ clienteAEliminar?.apellido }}</strong>?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="cerrarModal()">Cancelar</button>
              <button type="button" class="btn btn-danger" (click)="eliminarClienteConfirmado()">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de edición -->
      <div class="modal fade show" tabindex="-1" [ngStyle]="{display: mostrarModalEditar ? 'block' : 'none', background: 'rgba(0,0,0,0.5)'}" *ngIf="mostrarModalEditar">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="fas fa-edit me-2"></i>Editar cliente</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="cerrarModalEditar()"></button>
            </div>
            <form (ngSubmit)="guardarEdicion()" #formEditar="ngForm" novalidate>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" [(ngModel)]="clienteAEditar!.nombre" name="nombreEditar" required maxlength="50" #nombreEditar="ngModel" [ngClass]="{'is-invalid': nombreEditar.invalid && nombreEditar.touched}">
                  <div *ngIf="nombreEditar.invalid && nombreEditar.touched" class="invalid-feedback">Nombre es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Apellido</label>
                  <input type="text" class="form-control" [(ngModel)]="clienteAEditar!.apellido" name="apellidoEditar" required maxlength="50" #apellidoEditar="ngModel" [ngClass]="{'is-invalid': apellidoEditar.invalid && apellidoEditar.touched}">
                  <div *ngIf="apellidoEditar.invalid && apellidoEditar.touched" class="invalid-feedback">Apellido es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="clienteAEditar!.email" name="emailEditar" required maxlength="100" #emailEditar="ngModel" [ngClass]="{'is-invalid': emailEditar.invalid && emailEditar.touched}">
                  <div *ngIf="emailEditar.invalid && emailEditar.touched" class="invalid-feedback">Email válido es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Teléfono</label>
                  <input type="text" class="form-control" [(ngModel)]="clienteAEditar!.telefono" name="telefonoEditar" required maxlength="20" #telefonoEditar="ngModel" [ngClass]="{'is-invalid': telefonoEditar.invalid && telefonoEditar.touched}">
                  <div *ngIf="telefonoEditar.invalid && telefonoEditar.touched" class="invalid-feedback">Teléfono es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Área/Departamento</label>
                  <input type="text" class="form-control" [(ngModel)]="clienteAEditar!.areaDepartamento" name="areaDepartamentoEditar" required maxlength="50" #areaDepartamentoEditar="ngModel" [ngClass]="{'is-invalid': areaDepartamentoEditar.invalid && areaDepartamentoEditar.touched}">
                  <div *ngIf="areaDepartamentoEditar.invalid && areaDepartamentoEditar.touched" class="invalid-feedback">Área/Departamento es requerido</div>
                </div>
                <div *ngIf="mensajeExitoEditar" class="alert alert-success text-center">
                  <i class="fas fa-check-circle me-2"></i>{{ mensajeExitoEditar }}
                </div>
                <div *ngIf="mensajeErrorEditar" class="alert alert-danger text-center">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ mensajeErrorEditar }}
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="cerrarModalEditar()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="formEditar.invalid || cargandoEditar">
                  <i class="fas fa-save me-2"></i>Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .clientes-list-container { padding: 2rem; }
    h2 { margin-bottom: 1rem; }
    .table { background: #fff; }
    .table th, .table td { vertical-align: middle; }
    .modal { display: block; }
    .modal-backdrop { z-index: 1040; }
    .modal-dialog { z-index: 1050; }
  `]
})
export class ClientesListComponent {
  clientes: Cliente[] = [];
  error: string = '';
  mostrarModal = false;
  clienteAEliminar: Cliente | null = null;
  mostrarModalEditar = false;
  clienteAEditar: Cliente | null = null;
  mensajeExitoEditar = '';
  mensajeErrorEditar = '';
  cargandoEditar = false;

  constructor(private clienteService: ClienteService) {
    this.cargarClientes();
  }

  cargarClientes() {
    this.error = '';
    this.clienteService.getClientes().subscribe({
      next: (data) => { this.clientes = data; },
      error: () => { this.error = 'Error al cargar los clientes.'; }
    });
  }

  abrirModal(cliente: Cliente) {
    this.clienteAEliminar = cliente;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.clienteAEliminar = null;
  }

  eliminarClienteConfirmado() {
    if (!this.clienteAEliminar) return;
    this.clienteService.deleteCliente(this.clienteAEliminar.id).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarClientes();
      },
      error: () => {
        this.error = 'No se pudo eliminar el cliente.';
        this.cerrarModal();
      }
    });
  }

  abrirModalEditar(cliente: Cliente) {
    this.clienteAEditar = { ...cliente };
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.clienteAEditar = null;
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.cargandoEditar = false;
  }

  guardarEdicion() {
    if (!this.clienteAEditar) return;
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.cargandoEditar = true;
    const { id, ...rest } = this.clienteAEditar;
    this.clienteService.updateCliente(id, rest).subscribe({
      next: () => {
        this.mensajeExitoEditar = 'Registro modificado exitosamente!';
        this.cargandoEditar = false;
        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarClientes();
        }, 1200);
      },
      error: () => {
        this.mensajeErrorEditar = 'No se pudo modificar el cliente.';
        this.cargandoEditar = false;
      }
    });
  }
} 