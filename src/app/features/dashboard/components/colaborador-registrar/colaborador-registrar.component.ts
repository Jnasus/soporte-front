import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColaboradorService } from '../../services/colaborador.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-colaborador-registrar',
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
              <h2 class="fw-bold mb-0" style="color: #a259f7;">Registrar Colaborador</h2>
            </div>
            <form (ngSubmit)="onSubmit()" #form="ngForm" novalidate>
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="colaborador.nombre" name="nombre" required maxlength="50" #nombre="ngModel" [ngClass]="{'is-invalid': nombre.invalid && nombre.touched}">
                <div *ngIf="nombre.invalid && nombre.touched" class="invalid-feedback">Nombre es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-control" [(ngModel)]="colaborador.apellido" name="apellido" required maxlength="50" #apellido="ngModel" [ngClass]="{'is-invalid': apellido.invalid && apellido.touched}">
                <div *ngIf="apellido.invalid && apellido.touched" class="invalid-feedback">Apellido es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Teléfono</label>
                <input type="text" class="form-control" [(ngModel)]="colaborador.telefono" name="telefono" required maxlength="20" #telefono="ngModel" [ngClass]="{'is-invalid': telefono.invalid && telefono.touched}">
                <div *ngIf="telefono.invalid && telefono.touched" class="invalid-feedback">Teléfono es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Especialidad</label>
                <input type="text" class="form-control" [(ngModel)]="colaborador.especialidad" name="especialidad" required maxlength="50" #especialidad="ngModel" [ngClass]="{'is-invalid': especialidad.invalid && especialidad.touched}">
                <div *ngIf="especialidad.invalid && especialidad.touched" class="invalid-feedback">Especialidad es requerida</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Rating Promedio</label>
                <input type="number" step="0.01" class="form-control" [(ngModel)]="colaborador.ratingPromedio" name="ratingPromedio" required #ratingPromedio="ngModel" [ngClass]="{'is-invalid': ratingPromedio.invalid && ratingPromedio.touched}">
                <div *ngIf="ratingPromedio.invalid && ratingPromedio.touched" class="invalid-feedback">Rating es requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Tickets Resueltos</label>
                <input type="number" class="form-control" [(ngModel)]="colaborador.ticketsResueltos" name="ticketsResueltos" required #ticketsResueltos="ngModel" [ngClass]="{'is-invalid': ticketsResueltos.invalid && ticketsResueltos.touched}">
                <div *ngIf="ticketsResueltos.invalid && ticketsResueltos.touched" class="invalid-feedback">Tickets resueltos es requerido</div>
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
export class ColaboradorRegistrarComponent {
  colaborador = {
    nombre: '',
    apellido: '',
    telefono: '',
    especialidad: '',
    ratingPromedio: 0,
    ticketsResueltos: 0
  };
  mensajeExito = '';
  mensajeError = '';
  cargando = false;

  constructor(private colaboradorService: ColaboradorService, private router: Router) {}

  onSubmit() {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.cargando = true;
    this.colaboradorService.createColaborador(this.colaborador).subscribe({
      next: () => {
        this.mensajeExito = 'Registro guardado exitosamente!';
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/dashboard/colaboradores/listar']), 1200);
      },
      error: (err) => {
        this.mensajeError = 'No se pudo registrar el colaborador.';
        this.cargando = false;
      }
    });
  }
} 