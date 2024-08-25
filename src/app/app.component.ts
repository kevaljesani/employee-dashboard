import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddEmployeesComponent } from "./components/add-employees/add-employees.component";
import { CommonModule } from '@angular/common';
import { EmployeesListComponent } from "./components/employees-list/employees-list.component";
import { LoginComponent } from "./components/auth/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddEmployeesComponent, CommonModule, EmployeesListComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'employees-client';
  addEmployeeForm: boolean = false;
  selectedEmployee: any = null;

  @ViewChild(EmployeesListComponent) employeesListComponent!: EmployeesListComponent;

  toggleAddEmployeeForm(): void {
    this.selectedEmployee = null; // Reset selectedEmployee when adding new
    this.addEmployeeForm = !this.addEmployeeForm;
  }

  openEditForm(employee: any): void {
    this.selectedEmployee = employee; // Pass the employee data to the form
    this.addEmployeeForm = true; // Open the form for editing
    this.employeesListComponent.getAllEmployeeList()
  }

  handleEmployeeUpdate(employee: any): void {
    this.employeesListComponent.getAllEmployeeList()
    // this.getAllEmployeeList(); // Refresh the list after update
    this.addEmployeeForm = false;
  }

  cancelForm(): void {
    this.addEmployeeForm = false; // Close the form on cancel
  }
}
