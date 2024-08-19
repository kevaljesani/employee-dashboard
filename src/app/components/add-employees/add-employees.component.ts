import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  EmployeeService } from '../../services/employees.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employees',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-employees.component.html',
  styleUrl: './add-employees.component.css'
})
export class AddEmployeesComponent implements OnInit {

  employeesForm!: FormGroup;
  @Input() selectedEmployee: any = null; 
  @Output() employeeUpdated = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  constructor(
    private employeeService: EmployeeService, // Constructor Injection
    private fb: FormBuilder, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeesForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required], // Consider removing this for editing, or handle it conditionally
      gender: ['', Validators.required],
      city: ['', Validators.required],
      salary: [0, [Validators.min(0)]],
    });

    if (this.selectedEmployee) {
      this.employeesForm.patchValue(this.selectedEmployee);
      this.employeesForm.get('password')?.clearValidators(); // If you don't want to require a password on edit
      this.employeesForm.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.employeesForm.invalid) {
      this.employeesForm.markAllAsTouched();
      return;
    }

    if (this.selectedEmployee) {
      this.editEmployee();
    } else {
      this.addEmployee();
    }
  }

  addEmployee(): void {
    this.employeeService.addEmployeeService(this.employeesForm.value).subscribe({
      next: (res: any) => {
        alert('Employee details are added!!');
        this.employeeUpdated.emit(res.data); // Emit the new employee data
        this.employeesForm.reset();
        this.router.navigate(['/employee-list']);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  cancelForm(): void {
    this.cancel.emit(); // Emit cancel event
  }

  editEmployee(): void {
    this.employeeService.editEmployeeDetails(this.employeesForm.value, this.selectedEmployee._id).subscribe({
      next: (res: any) => {
        alert('Employee details are updated!!');
        this.employeeUpdated.emit(res.data); 
        this.employeesForm.reset();
        this.router.navigate(['/employee-list']);
        this.selectedEmployee = null; // Reset the form after editing
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
