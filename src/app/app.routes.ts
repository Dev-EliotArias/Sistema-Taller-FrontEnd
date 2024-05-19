import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { TableClientComponent } from './components/client/table-client/table-client.component';
// import { TableVehiclesComponent } from './components/vehiculos/table-vehicles/table-vehicles.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'clientes', component: TableClientComponent, canActivate: [authGuard] },
  // { path: 'vehiculos', component: TableVehiclesComponent, canActivate: [authGuard] }
];
