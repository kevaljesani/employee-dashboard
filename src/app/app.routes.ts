import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () =>
  //     import('../app/app.component').then(m => m.AppComponent)
  // },
  // {
  //   path: 'create',
  //   loadComponent: () =>
  //     import('../app/components/add-employees/add-employees.component').then(m => m.AddEmployeesComponent)
  // },
  // {
  //   path: 'employee-list',
  //   loadComponent: () =>
  //     import('../app/components/employees-list/employees-list.component').then(m => m.EmployeesListComponent)
  // },
  // {
  //   path: '**',
  //   redirectTo: 'employee-list'
  // }
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employee-list', component: EmployeesListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: '**', redirectTo: '/register' }
];
