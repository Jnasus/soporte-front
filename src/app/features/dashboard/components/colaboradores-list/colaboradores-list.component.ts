import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColaboradorService, Colaborador } from '../../services/colaborador.service';

@Component({
  selector: 'app-colaboradores-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="colaboradores-list-container">
      <h2 class="mb-4 text-secondary"><i class="fas fa-user-friends me-2"></i>Todos los Colaboradores</h2>
      <table class="table table-hover table-bordered rounded-3 overflow-hidden shadow-sm">
        <thead class="table-info text-dark">
          <tr>
            <th>ID</th><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Especialidad</th><th>Rating</th><th>Tickets Resueltos</th><th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let colaborador of colaboradores">
            <td>{{ colaborador.id }}</td>
            <td>{{ colaborador.nombre }}</td>
            <td>{{ colaborador.apellido }}</td>
            <td>{{ colaborador.telefono }}</td>
            <td>{{ colaborador.especialidad }}</td>
            <td>{{ colaborador.ratingPromedio }}</td>
            <td>{{ colaborador.ticketsResueltos }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" title="Editar" (click)="abrirModalEditar(colaborador)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" title="Eliminar" (click)="abrirModal(colaborador)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>

      <!-- Modal de eliminación -->
      <div class="modal fade show" tabindex="-1" [ngStyle]="{display: mostrarModal ? 'block' : 'none', background: 'rgba(0,0,0,0.5)'}" *ngIf="mostrarModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title"><i class="fas fa-exclamation-triangle me-2"></i>Confirmar eliminación</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="cerrarModal()"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas eliminar al colaborador <strong>{{ colaboradorAEliminar?.nombre }} {{ colaboradorAEliminar?.apellido }}</strong>?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="cerrarModal()">Cancelar</button>
              <button type="button" class="btn btn-danger" (click)="eliminarColaboradorConfirmado()">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de edición -->
      <div class="modal fade show" tabindex="-1" [ngStyle]="{display: mostrarModalEditar ? 'block' : 'none', background: 'rgba(0,0,0,0.5)'}" *ngIf="mostrarModalEditar">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="fas fa-edit me-2"></i>Editar colaborador</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="cerrarModalEditar()"></button>
            </div>
            <form (ngSubmit)="guardarEdicion()" #formEditar="ngForm" novalidate>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" [(ngModel)]="colaboradorAEditar!.nombre" name="nombreEditar" required maxlength="50" #nombreEditar="ngModel" [ngClass]="{'is-invalid': nombreEditar.invalid && nombreEditar.touched}">
                  <div *ngIf="nombreEditar.invalid && nombreEditar.touched" class="invalid-feedback">Nombre es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Apellido</label>
                  <input type="text" class="form-control" [(ngModel)]="colaboradorAEditar!.apellido" name="apellidoEditar" required maxlength="50" #apellidoEditar="ngModel" [ngClass]="{'is-invalid': apellidoEditar.invalid && apellidoEditar.touched}">
                  <div *ngIf="apellidoEditar.invalid && apellidoEditar.touched" class="invalid-feedback">Apellido es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Teléfono</label>
                  <input type="text" class="form-control" [(ngModel)]="colaboradorAEditar!.telefono" name="telefonoEditar" required maxlength="20" #telefonoEditar="ngModel" [ngClass]="{'is-invalid': telefonoEditar.invalid && telefonoEditar.touched}">
                  <div *ngIf="telefonoEditar.invalid && telefonoEditar.touched" class="invalid-feedback">Teléfono es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Especialidad</label>
                  <input type="text" class="form-control" [(ngModel)]="colaboradorAEditar!.especialidad" name="especialidadEditar" required maxlength="50" #especialidadEditar="ngModel" [ngClass]="{'is-invalid': especialidadEditar.invalid && especialidadEditar.touched}">
                  <div *ngIf="especialidadEditar.invalid && especialidadEditar.touched" class="invalid-feedback">Especialidad es requerida</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Rating Promedio</label>
                  <input type="number" step="0.01" class="form-control" [(ngModel)]="colaboradorAEditar!.ratingPromedio" name="ratingEditar" required #ratingEditar="ngModel" [ngClass]="{'is-invalid': ratingEditar.invalid && ratingEditar.touched}">
                  <div *ngIf="ratingEditar.invalid && ratingEditar.touched" class="invalid-feedback">Rating es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Tickets Resueltos</label>
                  <input type="number" class="form-control" [(ngModel)]="colaboradorAEditar!.ticketsResueltos" name="ticketsEditar" required #ticketsEditar="ngModel" [ngClass]="{'is-invalid': ticketsEditar.invalid && ticketsEditar.touched}">
                  <div *ngIf="ticketsEditar.invalid && ticketsEditar.touched" class="invalid-feedback">Tickets resueltos es requerido</div>
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
    .colaboradores-list-container { padding: 2rem; }
    h2 { margin-bottom: 1rem; }
    .table { background: #fff; }
    .table th, .table td { vertical-align: middle; }
    .modal { display: block; }
    .modal-backdrop { z-index: 1040; }
    .modal-dialog { z-index: 1050; }
  `]
})
export class ColaboradoresListComponent {
  colaboradores: Colaborador[] = [];
  error: string = '';
  mostrarModal = false;
  colaboradorAEliminar: Colaborador | null = null;
  mostrarModalEditar = false;
  colaboradorAEditar: Colaborador | null = null;
  mensajeExitoEditar = '';
  mensajeErrorEditar = '';
  cargandoEditar = false;

  constructor(private colaboradorService: ColaboradorService) {
    this.cargarColaboradores();
  }

  cargarColaboradores() {
    this.error = '';
    this.colaboradorService.getColaboradores().subscribe({
      next: (data) => { this.colaboradores = data; },
      error: () => { this.error = 'Error al cargar los colaboradores.'; }
    });
  }

  abrirModal(colaborador: Colaborador) {
    this.colaboradorAEliminar = colaborador;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.colaboradorAEliminar = null;
  }

  eliminarColaboradorConfirmado() {
    if (!this.colaboradorAEliminar) return;
    this.colaboradorService.deleteColaborador(this.colaboradorAEliminar.id).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarColaboradores();
      },
      error: () => {
        this.error = 'No se pudo eliminar el colaborador.';
        this.cerrarModal();
      }
    });
  }

  abrirModalEditar(colaborador: Colaborador) {
    this.colaboradorAEditar = { ...colaborador };
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.colaboradorAEditar = null;
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.cargandoEditar = false;
  }

  guardarEdicion() {
    if (!this.colaboradorAEditar) return;
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.cargandoEditar = true;
    const { id, ...rest } = this.colaboradorAEditar;
    this.colaboradorService.updateColaborador(id, rest).subscribe({
      next: () => {
        this.mensajeExitoEditar = 'Registro modificado exitosamente!';
        this.cargandoEditar = false;
        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarColaboradores();
        }, 1200);
      },
      error: () => {
        this.mensajeErrorEditar = 'No se pudo modificar el colaborador.';
        this.cargandoEditar = false;
      }
    });
  }
} 