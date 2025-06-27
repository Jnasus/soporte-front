import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../../../services/auth.service';
import { Cliente, ClienteService } from '../../services/cliente.service';
import { Colaborador, ColaboradorService } from '../../services/colaborador.service';
import { Solicitud } from '../../../../models/solicitud.model';

@Component({
  selector: 'app-solicitud-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-3">
      <h2>Registrar Solicitud</h2>
      <form [formGroup]="solicitudForm" (ngSubmit)="registrar()">
        <div class="mb-3">
          <label for="titulo" class="form-label">Título</label>
          <input id="titulo" type="text" class="form-control" formControlName="titulo">
          <div *ngIf="solicitudForm.get('titulo')?.invalid && solicitudForm.get('titulo')?.touched" class="text-danger">Título requerido</div>
        </div>
        <div class="mb-3">
          <label for="descripcion" class="form-label">Descripción</label>
          <textarea id="descripcion" class="form-control" formControlName="descripcion"></textarea>
          <div *ngIf="solicitudForm.get('descripcion')?.invalid && solicitudForm.get('descripcion')?.touched" class="text-danger">Descripción requerida</div>
        </div>
        <div class="mb-3">
          <label for="estado" class="form-label">Estado</label>
          <select id="estado" class="form-select" formControlName="estado">
            <option value="">Seleccione...</option>
            <option value="NUEVO">Nuevo</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="CERRADO">Cerrado</option>
          </select>
          <div *ngIf="solicitudForm.get('estado')?.invalid && solicitudForm.get('estado')?.touched" class="text-danger">Estado requerido</div>
        </div>
        <div class="mb-3">
          <label for="prioridad" class="form-label">Prioridad</label>
          <select id="prioridad" class="form-select" formControlName="prioridad">
            <option value="">Seleccione...</option>
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
          <div *ngIf="solicitudForm.get('prioridad')?.invalid && solicitudForm.get('prioridad')?.touched" class="text-danger">Prioridad requerida</div>
        </div>
        <div class="mb-3" *ngIf="userRole === 'ADMIN'">
          <label for="clienteId" class="form-label">Cliente</label>
          <select id="clienteId" class="form-select" formControlName="clienteId">
            <option value="">Seleccione...</option>
            <option *ngFor="let c of clientes" [value]="c.id">{{ c.nombre }} {{ c.apellido }}</option>
          </select>
          <div *ngIf="solicitudForm.get('clienteId')?.invalid && solicitudForm.get('clienteId')?.touched" class="text-danger">Cliente requerido</div>
        </div>
        <button class="btn btn-success" type="submit" [disabled]="solicitudForm.invalid">Registrar</button>
      </form>
      <div *ngIf="mensaje" class="alert alert-success mt-2">{{ mensaje }}</div>
      <div *ngIf="error" class="alert alert-danger mt-2">{{ error }}</div>
    </div>
  `
})
export class SolicitudRegistrarComponent implements OnInit {
  solicitudForm: FormGroup;
  userRole: string | null = null;
  clientes: Cliente[] = [];
  colaboradores: Colaborador[] = [];
  errorMessage: string | null = null;
  mensaje = '';
  error = '';
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private authService: AuthService,
    private clienteService: ClienteService,
    private colaboradorService: ColaboradorService,
    private router: Router,
    private location: Location
  ) {
    this.solicitudForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required],
      prioridad: ['', Validators.required],
      clienteId: [null, Validators.required],
      colaboradorId: [null]
    });
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    
    if (this.userRole === 'ADMIN') {
      this.clienteService.getClientes().subscribe({
        next: (data) => this.clientes = data,
        error: () => this.error = 'Error al cargar clientes'
      });
    } else if (this.userRole === 'CLIENTE') {
      // Para usuarios CLIENTE, obtener el ID del cliente desde el token
      this.clienteId = this.authService.getAccountId();
      if (this.clienteId) {
        this.solicitudForm.patchValue({ clienteId: this.clienteId });
        this.solicitudForm.get('clienteId')?.disable();
        // Remover la validación requerida para CLIENTE ya que el campo está deshabilitado
        this.solicitudForm.get('clienteId')?.clearValidators();
        this.solicitudForm.get('clienteId')?.updateValueAndValidity();
      } else {
        this.error = 'No se pudo identificar al cliente. Por favor, inicie sesión nuevamente.';
      }
    } else if (this.userRole === 'COLABORADOR') {
      this.loadClientes();
      this.solicitudForm.get('clienteId')?.setValidators(Validators.required);
    }
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe((data: Cliente[]) => this.clientes = data);
  }

  loadColaboradores(): void {
    this.colaboradorService.getColaboradores().subscribe((data: Colaborador[]) => this.colaboradores = data);
  }

  registrar(): void {
    console.log('Método registrar() llamado');
    console.log('Formulario válido:', this.solicitudForm.valid);
    console.log('Valores del formulario:', this.solicitudForm.value);
    
    if (this.solicitudForm.invalid) {
      console.log('Formulario inválido, no se puede registrar');
      return;
    }
    
    let solicitud: Solicitud = this.solicitudForm.getRawValue();
    console.log('Solicitud a enviar:', solicitud);
    
    // Para usuarios CLIENTE, asegurar que se use el clienteId correcto
    if (this.userRole === 'CLIENTE' && this.clienteId) {
      solicitud.clienteId = this.clienteId;
    }
    
    console.log('Enviando solicitud al servicio...');
    this.solicitudService.create(solicitud).subscribe({
      next: (response) => {
        console.log('Solicitud creada exitosamente:', response);
        this.mensaje = 'Solicitud registrada con éxito';
        this.error = '';
        this.solicitudForm.reset();
        if (this.userRole === 'CLIENTE') {
          this.solicitudForm.patchValue({ clienteId: this.clienteId });
        }
      },
      error: (err) => {
        console.error('Error al crear solicitud:', err);
        this.error = 'Error al registrar solicitud';
        this.mensaje = '';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
} 