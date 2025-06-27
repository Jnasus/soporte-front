import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { ColaboradorService, Colaborador } from '../../services/colaborador.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg p-4 rounded-4">
            <div class="text-center mb-4">
              <span class="d-inline-block bg-gradient p-3 rounded-circle mb-2" style="background: linear-gradient(135deg, #a259f7 60%, #f7b32b 100%);">
                <i class="fas fa-user-plus fa-2x text-white"></i>
              </span>
              <h2 class="fw-bold mb-0" style="color: #a259f7;">Registrar Usuario</h2>
            </div>
            <form (ngSubmit)="onSubmit()" #form="ngForm" novalidate>
              <div class="mb-3">
                <label class="form-label">Tipo de cuenta</label>
                <select class="form-select" [(ngModel)]="tipoCuenta" name="tipoCuenta" required>
                  <option value="independiente">Independiente</option>
                  <option value="cliente">Asociar a cliente</option>
                  <option value="colaborador">Asociar a colaborador</option>
                </select>
              </div>
              <div class="mb-3" *ngIf="tipoCuenta === 'cliente'">
                <label class="form-label">Seleccionar cliente</label>
                <select class="form-select" [(ngModel)]="usuario.clienteId" name="clienteId" required>
                  <option [ngValue]="null">Seleccione un cliente</option>
                  <option *ngFor="let c of clientes" [ngValue]="c.id">{{ c.nombre }} {{ c.apellido }} ({{ c.email }})</option>
                </select>
              </div>
              <div class="mb-3" *ngIf="tipoCuenta === 'colaborador'">
                <label class="form-label">Seleccionar colaborador</label>
                <select class="form-select" [(ngModel)]="usuario.colaboradorId" name="colaboradorId" required>
                  <option [ngValue]="null">Seleccione un colaborador</option>
                  <option *ngFor="let c of colaboradores" [ngValue]="c.id">{{ c.nombre }} {{ c.apellido }} ({{ c.especialidad }})</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Rol</label>
                <select class="form-select" [(ngModel)]="usuario.role" name="role" required>
                  <option [ngValue]="null">Seleccione un rol</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="COLABORADOR">COLABORADOR</option>
                  <option value="CLIENTE">CLIENTE</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" [(ngModel)]="usuario.email" name="email" required maxlength="100" #email="ngModel" [ngClass]="{'is-invalid': email.invalid && email.touched}">
                <div *ngIf="email.invalid && email.touched" class="invalid-feedback">Email válido es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" [(ngModel)]="usuario.password" name="password" required minlength="4" #password="ngModel" [ngClass]="{'is-invalid': password.invalid && password.touched}">
                <div *ngIf="password.invalid && password.touched" class="invalid-feedback">Contraseña es requerida</div>
              </div>
              <div *ngIf="mensajeExito" class="alert alert-success text-center">
                <i class="fas fa-check-circle me-2"></i>{{ mensajeExito }}
              </div>
              <div *ngIf="mensajeError" class="alert alert-danger text-center">
                <i class="fas fa-exclamation-circle me-2"></i>{{ mensajeError }}
              </div>
              <button type="submit" class="btn w-100 fw-bold text-white mt-2" [disabled]="form.invalid || cargando"
                style="background: linear-gradient(135deg, #a259f7 60%, #f7b32b 100%);">
                <i class="fas fa-save me-2"></i>Registrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class UsuarioRegistrarComponent implements OnInit {
  usuario = {
    email: '',
    role: '',
    password: '',
    colaboradorId: null,
    clienteId: null
  };
  tipoCuenta: 'independiente' | 'cliente' | 'colaborador' = 'independiente';
  clientes: Cliente[] = [];
  colaboradores: Colaborador[] = [];
  mensajeExito = '';
  mensajeError = '';
  cargando = false;

  constructor(
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private colaboradorService: ColaboradorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clienteService.getClientes().subscribe({ next: data => this.clientes = data });
    this.colaboradorService.getColaboradores().subscribe({ next: data => this.colaboradores = data });
  }

  onSubmit() {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.cargando = true;
    // Validar que el rol no sea vacío
    if (!this.usuario.role) {
      this.mensajeError = 'Debe seleccionar un rol.';
      this.cargando = false;
      return;
    }
    // Limpiar campos según tipo de cuenta
    if (this.tipoCuenta === 'independiente') {
      this.usuario.clienteId = null;
      this.usuario.colaboradorId = null;
    } else if (this.tipoCuenta === 'cliente') {
      this.usuario.colaboradorId = null;
    } else if (this.tipoCuenta === 'colaborador') {
      this.usuario.clienteId = null;
    }
    // Castear el rol al tipo correcto
    const usuarioParaCrear = {
      ...this.usuario,
      role: this.usuario.role as 'ADMIN' | 'COLABORADOR' | 'CLIENTE'
    };
    this.usuarioService.createUsuario(usuarioParaCrear).subscribe({
      next: () => {
        this.mensajeExito = 'Registro guardado exitosamente!';
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/dashboard/usuarios/listar']), 1200);
      },
      error: (err) => {
        this.mensajeError = 'No se pudo registrar el usuario.';
        this.cargando = false;
      }
    });
  }
} 