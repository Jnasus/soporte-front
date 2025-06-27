import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-registrar',
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
              <h2 class="fw-bold mb-0" style="color: #a259f7;">Registrar Cliente</h2>
            </div>
            <form (ngSubmit)="onSubmit()" #form="ngForm" novalidate>
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="cliente.nombre" name="nombre" required maxlength="50" #nombre="ngModel" [ngClass]="{'is-invalid': nombre.invalid && nombre.touched}">
                <div *ngIf="nombre.invalid && nombre.touched" class="invalid-feedback">Nombre es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-control" [(ngModel)]="cliente.apellido" name="apellido" required maxlength="50" #apellido="ngModel" [ngClass]="{'is-invalid': apellido.invalid && apellido.touched}">
                <div *ngIf="apellido.invalid && apellido.touched" class="invalid-feedback">Apellido es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" [(ngModel)]="cliente.email" name="email" required maxlength="100" #email="ngModel" [ngClass]="{'is-invalid': email.invalid && email.touched}">
                <div *ngIf="email.invalid && email.touched" class="invalid-feedback">Email válido es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Teléfono</label>
                <input type="text" class="form-control" [(ngModel)]="cliente.telefono" name="telefono" required maxlength="20" #telefono="ngModel" [ngClass]="{'is-invalid': telefono.invalid && telefono.touched}">
                <div *ngIf="telefono.invalid && telefono.touched" class="invalid-feedback">Teléfono es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Área/Departamento</label>
                <input type="text" class="form-control" [(ngModel)]="cliente.areaDepartamento" name="areaDepartamento" required maxlength="50" #areaDepartamento="ngModel" [ngClass]="{'is-invalid': areaDepartamento.invalid && areaDepartamento.touched}">
                <div *ngIf="areaDepartamento.invalid && areaDepartamento.touched" class="invalid-feedback">Área/Departamento es requerido</div>
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
export class ClienteRegistrarComponent {
  cliente = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    areaDepartamento: ''
  };
  mensajeExito = '';
  mensajeError = '';
  cargando = false;

  constructor(private clienteService: ClienteService, private router: Router) {}

  onSubmit() {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.cargando = true;
    this.clienteService.createCliente(this.cliente).subscribe({
      next: () => {
        this.mensajeExito = 'Registro guardado exitosamente!';
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/dashboard/clientes/listar']), 1200);
      },
      error: (err) => {
        this.mensajeError = 'No se pudo registrar el cliente.';
        this.cargando = false;
      }
    });
  }
} 