import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/app.component').then(m => m.AppComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('../app/components/add-employees/add-employees.component').then(m => m.AddEmployeesComponent)
  },
  {
    path: 'employee-list',
    loadComponent: () =>
      import('../app/components/employees-list/employees-list.component').then(m => m.EmployeesListComponent)
  },
  {
    path: '**',
    redirectTo: 'employee-list'
  }
];
