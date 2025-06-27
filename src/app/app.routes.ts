import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ClientesListComponent } from './features/dashboard/components/clientes-list/clientes-list.component';
import { ClienteBuscarComponent } from './features/dashboard/components/cliente-buscar/cliente-buscar.component';
import { ClienteRegistrarComponent } from './features/dashboard/components/cliente-registrar/cliente-registrar.component';
import { ColaboradoresListComponent } from './features/dashboard/components/colaboradores-list/colaboradores-list.component';
import { ColaboradorBuscarComponent } from './features/dashboard/components/colaborador-buscar/colaborador-buscar.component';
import { ColaboradorRegistrarComponent } from './features/dashboard/components/colaborador-registrar/colaborador-registrar.component';
import { UsuariosListComponent } from './features/dashboard/components/usuarios-list/usuarios-list.component';
// import { UsuarioBuscarComponent } from './features/dashboard/components/usuario-buscar/usuario-buscar.component';
import { UsuarioRegistrarComponent } from './features/dashboard/components/usuario-registrar/usuario-registrar.component';
import { SolicitudesListarComponent } from './features/dashboard/components/solicitudes-list/solicitudes-listar.component';
import { SolicitudRegistrarComponent } from './features/dashboard/components/solicitud-registrar/solicitud-registrar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'clientes',
        children: [
          { path: '', redirectTo: 'listar', pathMatch: 'full' },
          { path: 'listar', component: ClientesListComponent },
          { path: 'buscar', component: ClienteBuscarComponent },
          { path: 'registrar', component: ClienteRegistrarComponent }
        ]
      },
      {
        path: 'colaboradores',
        children: [
          { path: '', redirectTo: 'listar', pathMatch: 'full' },
          { path: 'listar', component: ColaboradoresListComponent },
          { path: 'buscar', component: ColaboradorBuscarComponent },
          { path: 'registrar', component: ColaboradorRegistrarComponent }
        ]
      },
      {
        path: 'usuarios',
        children: [
          { path: '', redirectTo: 'listar', pathMatch: 'full' },
          { path: 'listar', component: UsuariosListComponent },
          // { path: 'buscar', component: UsuarioBuscarComponent, canActivate: [AuthGuard] },
          { path: 'registrar', component: UsuarioRegistrarComponent }
        ]
      },
      {
        path: 'solicitudes',
        children: [
          { path: '', redirectTo: 'listar', pathMatch: 'full' },
          { path: 'listar', component: SolicitudesListarComponent },
          { path: 'registrar', component: SolicitudRegistrarComponent }
        ]
      },
      // Add more dashboard routes here as needed
    ]
  }
];
