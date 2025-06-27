import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%; border-radius: 1.5rem;">
        <div class="text-center mb-4">
          <span class="d-inline-block bg-gradient p-3 rounded-circle mb-2" style="background: linear-gradient(135deg, #a259f7 60%, #f7b32b 100%);">
            <i class="fas fa-user fa-2x text-white"></i>
          </span>
          <h2 class="fw-bold mb-0" style="color: #a259f7;">Iniciar Sesión</h2>
        </div>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              #emailInput="ngModel"
              class="form-control"
              [ngClass]="{'is-invalid': emailInput.invalid && emailInput.touched}"
              placeholder="usuario@correo.com"
            />
            <div *ngIf="emailInput.invalid && emailInput.touched" class="invalid-feedback">
              Email es requerido
            </div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              #passwordInput="ngModel"
              class="form-control"
              [ngClass]="{'is-invalid': passwordInput.invalid && passwordInput.touched}"
              placeholder="••••••••"
            />
            <div *ngIf="passwordInput.invalid && passwordInput.touched" class="invalid-feedback">
              Contraseña es requerida
            </div>
          </div>
          <div *ngIf="errorMessage" class="alert alert-danger text-center py-2">
            <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
          </div>
          <button type="submit" class="btn w-100 fw-bold text-white mt-2" [disabled]="loginForm.invalid"
            style="background: linear-gradient(135deg, #a259f7 60%, #f7b32b 100%);">
            <i class="fas fa-sign-in-alt me-2"></i>Ingresar
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [``]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Email o contraseña incorrectos';
        }
      },
      error: () => {
        this.errorMessage = 'Email o contraseña incorrectos';
      }
    });
  }
} 