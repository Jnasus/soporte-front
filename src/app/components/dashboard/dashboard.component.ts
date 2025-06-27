import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid min-vh-100 p-0">
      <div class="row g-0 min-vh-100">
        <nav class="col-12 col-md-3 col-lg-2 d-md-block sidebar-custom text-white position-fixed h-100">
          <div class="sidebar-sticky pt-3">
            <h3 class="text-center mb-4 fw-bold"><i class="fas fa-gem me-2"></i>Digital</h3>
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/home" routerLinkActive="active">
                  <i class="fas fa-home me-2"></i> <span>Home</span>
                </a>
              </li>
              <li class="nav-item mb-2">
                <button class="nav-link text-white d-flex align-items-center w-100 sidebar-btn" (click)="toggleClientesMenu()" [attr.aria-expanded]="clientesMenuOpen">
                  <i class="fas fa-users me-2"></i> <span>Clientes</span>
                  <i class="fas ms-auto" [ngClass]="clientesMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                </button>
                <ul class="nav flex-column ms-4 sidebar-submenu" *ngIf="clientesMenuOpen">
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/clientes/listar" routerLinkActive="active">
                      <i class="fas fa-list me-2"></i> <span>Listar todos</span>
                    </a>
                  </li>
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/clientes/buscar" routerLinkActive="active">
                      <i class="fas fa-search me-2"></i> <span>Buscar por ID</span>
                    </a>
                  </li>
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/clientes/registrar" routerLinkActive="active">
                      <i class="fas fa-user-plus me-2"></i> <span>Registrar cliente</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item mb-2">
                <button class="nav-link text-white d-flex align-items-center w-100 sidebar-btn" (click)="toggleColaboradoresMenu()" [attr.aria-expanded]="colaboradoresMenuOpen">
                  <i class="fas fa-user-friends me-2"></i> <span>Colaboradores</span>
                  <i class="fas ms-auto" [ngClass]="colaboradoresMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                </button>
                <ul class="nav flex-column ms-4 sidebar-submenu" *ngIf="colaboradoresMenuOpen">
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/colaboradores/listar" routerLinkActive="active">
                      <i class="fas fa-list me-2"></i> <span>Listar todos</span>
                    </a>
                  </li>
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/colaboradores/buscar" routerLinkActive="active">
                      <i class="fas fa-search me-2"></i> <span>Buscar por ID</span>
                    </a>
                  </li>
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/colaboradores/registrar" routerLinkActive="active">
                      <i class="fas fa-user-plus me-2"></i> <span>Registrar colaborador</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li *ngIf="userRole === 'ADMIN'" class="nav-item mb-2">
                <button class="nav-link text-white d-flex align-items-center w-100 sidebar-btn" (click)="toggleUsuariosMenu()" [attr.aria-expanded]="usuariosMenuOpen">
                  <i class="fas fa-users-cog me-2"></i> <span>Usuarios</span>
                  <i class="fas ms-auto" [ngClass]="usuariosMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                </button>
                <ul class="nav flex-column ms-4 sidebar-submenu" *ngIf="usuariosMenuOpen">
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/usuarios/listar" routerLinkActive="active">
                      <i class="fas fa-list me-2"></i> <span>Listar todos</span>
                    </a>
                  </li>
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/usuarios/buscar" routerLinkActive="active">
                      <i class="fas fa-search me-2"></i> <span>Buscar por ID</span>
                    </a>
                  </li>
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/usuarios/registrar" routerLinkActive="active">
                      <i class="fas fa-user-plus me-2"></i> <span>Registrar usuario</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li *ngIf="userRole === 'ADMIN' || userRole === 'CLIENTE'" class="nav-item mb-2">
                <button class="nav-link text-white d-flex align-items-center w-100 sidebar-btn" (click)="toggleSolicitudesMenu()" [attr.aria-expanded]="solicitudesMenuOpen">
                  <i class="fas fa-file-alt me-2"></i> <span>Solicitudes</span>
                  <i class="fas ms-auto" [ngClass]="solicitudesMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                </button>
                <ul class="nav flex-column ms-4 sidebar-submenu" *ngIf="solicitudesMenuOpen">
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/solicitudes/listar" routerLinkActive="active">
                      <i class="fas fa-list me-2"></i> <span>Listar solicitudes</span>
                    </a>
                  </li>
                  <li class="nav-item mb-1">
                    <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/solicitudes/registrar" routerLinkActive="active">
                      <i class="fas fa-plus me-2"></i> <span>Registrar solicitud</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/profile" routerLinkActive="active">
                  <i class="fas fa-user me-2"></i> <span>Profile</span>
                </a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link text-white d-flex align-items-center" routerLink="/dashboard/settings" routerLinkActive="active">
                  <i class="fas fa-cog me-2"></i> <span>Settings</span>
                </a>
              </li>
              <li class="nav-item mt-4">
                <a class="nav-link text-white d-flex align-items-center" (click)="logout()">
                  <i class="fas fa-sign-out-alt me-2"></i> <span>Logout</span>
                </a>
              </li>
            </ul>
            <button class="btn btn-light w-100 mt-4 d-md-none" (click)="toggleSidebar()">
              {{ isSidebarCollapsed ? 'Mostrar menú' : 'Ocultar menú' }}
            </button>
          </div>
        </nav>
        <main class="col-12 offset-md-3 offset-lg-2 col-md-9 col-lg-10 ms-sm-auto px-4" [ngStyle]="{'margin-left': isSidebarCollapsed ? '0' : '16.6667%'}">
          <div class="py-3 mb-4 border-bottom bg-white shadow-sm rounded-3">
            <h1 class="h4" style="color: #a259f7;">Bienvenido {{ userEmail }}</h1>
          </div>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `.sidebar-custom { min-width: 220px; background: linear-gradient(135deg, #a259f7 60%, #f7b32b 100%); box-shadow: 2px 0 10px rgba(162,89,247,0.1); }`,
    `.sidebar-custom .nav-link.active, .sidebar-custom .nav-link:hover { background: rgba(255,255,255,0.18); border-radius: 0.375rem; color: #fff !important; }`,
    `.sidebar-custom .nav-link { font-weight: 500; transition: background 0.2s; }`,
    `.sidebar-sticky { position: sticky; top: 0; }`,
    `.sidebar-btn { background: none; border: none; outline: none; text-align: left; padding: 0.75rem 1rem; cursor: pointer; }`,
    `.sidebar-btn:focus { box-shadow: none; }`,
    `.sidebar-submenu { background: transparent; }`,
    `.content { padding: 2rem 0; }`,
    `@media (max-width: 767.98px) { .sidebar-custom { position: static; min-width: 100%; } }`
  ]
})
export class DashboardComponent {
  isSidebarCollapsed = false;
  clientesMenuOpen = true;
  colaboradoresMenuOpen = false;
  usuariosMenuOpen = false;
  solicitudesMenuOpen = false;
  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleClientesMenu(): void {
    this.clientesMenuOpen = !this.clientesMenuOpen;
  }

  toggleColaboradoresMenu(): void {
    this.colaboradoresMenuOpen = !this.colaboradoresMenuOpen;
  }

  toggleUsuariosMenu(): void {
    this.usuariosMenuOpen = !this.usuariosMenuOpen;
  }

  toggleSolicitudesMenu(): void {
    this.solicitudesMenuOpen = !this.solicitudesMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 