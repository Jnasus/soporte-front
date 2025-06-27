import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { ColaboradorService, Colaborador } from '../../services/colaborador.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="usuarios-list-container">
      <h2 class="mb-4 text-secondary"><i class="fas fa-users-cog me-2"></i>Todos los Usuarios</h2>
      <table class="table table-hover table-bordered rounded-3 overflow-hidden shadow-sm">
        <thead class="table-info text-dark">
          <tr>
            <th>ID</th><th>Email</th><th>Rol</th><th>Cliente</th><th>Colaborador</th><th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let usuario of usuarios">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.role }}</td>
            <td>{{ getClienteNombre(usuario.clienteId) }}</td>
            <td>{{ getColaboradorNombre(usuario.colaboradorId) }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" title="Editar" (click)="abrirModalEditar(usuario)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" title="Eliminar" (click)="abrirModal(usuario)">
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
              <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ usuarioAEliminar?.email }}</strong>?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="cerrarModal()">Cancelar</button>
              <button type="button" class="btn btn-danger" (click)="eliminarUsuarioConfirmado()">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de edición -->
      <div class="modal fade show" tabindex="-1" [ngStyle]="{display: mostrarModalEditar ? 'block' : 'none', background: 'rgba(0,0,0,0.5)'}" *ngIf="mostrarModalEditar">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="fas fa-edit me-2"></i>Editar usuario</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="cerrarModalEditar()"></button>
            </div>
            <form (ngSubmit)="guardarEdicion()" #formEditar="ngForm" novalidate>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Tipo de cuenta</label>
                  <select class="form-select" [(ngModel)]="tipoCuentaEditar" name="tipoCuentaEditar" required>
                    <option value="independiente">Independiente</option>
                    <option value="cliente">Asociar a cliente</option>
                    <option value="colaborador">Asociar a colaborador</option>
                  </select>
                </div>
                <div class="mb-3" *ngIf="tipoCuentaEditar === 'cliente'">
                  <label class="form-label">Seleccionar cliente</label>
                  <select class="form-select" [(ngModel)]="usuarioAEditar!.clienteId" name="clienteIdEditar" required>
                    <option [ngValue]="null">Seleccione un cliente</option>
                    <option *ngFor="let c of clientes" [ngValue]="c.id">{{ c.nombre }} {{ c.apellido }} ({{ c.email }})</option>
                  </select>
                </div>
                <div class="mb-3" *ngIf="tipoCuentaEditar === 'colaborador'">
                  <label class="form-label">Seleccionar colaborador</label>
                  <select class="form-select" [(ngModel)]="usuarioAEditar!.colaboradorId" name="colaboradorIdEditar" required>
                    <option [ngValue]="null">Seleccione un colaborador</option>
                    <option *ngFor="let c of colaboradores" [ngValue]="c.id">{{ c.nombre }} {{ c.apellido }} ({{ c.especialidad }})</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Rol</label>
                  <select class="form-select" [(ngModel)]="usuarioAEditar!.role" name="roleEditar" required>
                    <option [ngValue]="null">Seleccione un rol</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="COLABORADOR">COLABORADOR</option>
                    <option value="CLIENTE">CLIENTE</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="usuarioAEditar!.email" name="emailEditar" required maxlength="100" #emailEditar="ngModel" [ngClass]="{'is-invalid': emailEditar.invalid && emailEditar.touched}">
                  <div *ngIf="emailEditar.invalid && emailEditar.touched" class="invalid-feedback">Email válido es requerido</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña (dejar vacío para no cambiar)</label>
                  <input type="password" class="form-control" [(ngModel)]="usuarioAEditar!.password" name="passwordEditar" minlength="4" #passwordEditar="ngModel" [ngClass]="{'is-invalid': passwordEditar.invalid && passwordEditar.touched}">
                  <div *ngIf="passwordEditar.invalid && passwordEditar.touched" class="invalid-feedback">Contraseña debe tener al menos 4 caracteres</div>
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
    .usuarios-list-container { padding: 2rem; }
    h2 { margin-bottom: 1rem; }
    .table { background: #fff; }
    .table th, .table td { vertical-align: middle; }
    .modal { display: block; }
    .modal-backdrop { z-index: 1040; }
    .modal-dialog { z-index: 1050; }
  `]
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  clientes: Cliente[] = [];
  colaboradores: Colaborador[] = [];
  error: string = '';
  mostrarModal = false;
  usuarioAEliminar: Usuario | null = null;
  mostrarModalEditar = false;
  usuarioAEditar: Usuario | null = null;
  tipoCuentaEditar: 'independiente' | 'cliente' | 'colaborador' = 'independiente';
  mensajeExitoEditar = '';
  mensajeErrorEditar = '';
  cargandoEditar = false;

  constructor(
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private colaboradorService: ColaboradorService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.clienteService.getClientes().subscribe({ next: data => this.clientes = data });
    this.colaboradorService.getColaboradores().subscribe({ next: data => this.colaboradores = data });
  }

  cargarUsuarios() {
    this.error = '';
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => { this.usuarios = data; },
      error: () => { this.error = 'Error al cargar los usuarios.'; }
    });
  }

  getClienteNombre(clienteId: number | null) {
    if (!clienteId) return '';
    const c = this.clientes.find(x => x.id === clienteId);
    return c ? `${c.nombre} ${c.apellido}` : '';
  }

  getColaboradorNombre(colaboradorId: number | null) {
    if (!colaboradorId) return '';
    const c = this.colaboradores.find(x => x.id === colaboradorId);
    return c ? `${c.nombre} ${c.apellido}` : '';
  }

  abrirModal(usuario: Usuario) {
    this.usuarioAEliminar = usuario;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioAEliminar = null;
  }

  eliminarUsuarioConfirmado() {
    if (!this.usuarioAEliminar) return;
    this.usuarioService.deleteUsuario(this.usuarioAEliminar.id).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarUsuarios();
      },
      error: () => {
        this.error = 'No se pudo eliminar el usuario.';
        this.cerrarModal();
      }
    });
  }

  abrirModalEditar(usuario: Usuario) {
    this.usuarioAEditar = { ...usuario, password: '' };
    if (usuario.clienteId) this.tipoCuentaEditar = 'cliente';
    else if (usuario.colaboradorId) this.tipoCuentaEditar = 'colaborador';
    else this.tipoCuentaEditar = 'independiente';
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.usuarioAEditar = null;
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.cargandoEditar = false;
  }

  guardarEdicion() {
    if (!this.usuarioAEditar) return;
    this.mensajeExitoEditar = '';
    this.mensajeErrorEditar = '';
    this.cargandoEditar = true;
    // Limpiar campos según tipo de cuenta
    if (this.tipoCuentaEditar === 'independiente') {
      this.usuarioAEditar.clienteId = null;
      this.usuarioAEditar.colaboradorId = null;
    } else if (this.tipoCuentaEditar === 'cliente') {
      this.usuarioAEditar.colaboradorId = null;
    } else if (this.tipoCuentaEditar === 'colaborador') {
      this.usuarioAEditar.clienteId = null;
    }
    // Si el password está vacío, no lo enviamos (lo eliminamos del objeto)
    const { id, ...rest } = this.usuarioAEditar;
    if (!rest.password) delete rest.password;
    this.usuarioService.updateUsuario(id, rest as any).subscribe({
      next: () => {
        this.mensajeExitoEditar = 'Registro modificado exitosamente!';
        this.cargandoEditar = false;
        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarUsuarios();
        }, 1200);
      },
      error: () => {
        this.mensajeErrorEditar = 'No se pudo modificar el usuario.';
        this.cargandoEditar = false;
      }
    });
  }
} 