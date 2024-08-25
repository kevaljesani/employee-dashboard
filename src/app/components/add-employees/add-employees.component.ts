import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  EmployeeService } from '../../services/employees.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-employees',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-employees.component.html',
  styleUrl: './add-employees.component.css'
})
export class AddEmployeesComponent implements OnInit {
  employeesForm!: FormGroup;
  audioFileValid = true;
  @Output() employeeUpdated = new EventEmitter<any>();
  selectedFile: File | null = null;
  selectedFileName: string | null = null; 
  @Input() selectedEmployee: any = null;
  @Output() cancel = new EventEmitter<void>();
  constructor(private employeeService: EmployeeService,private fb: FormBuilder, private http: HttpClient, private router: Router) {}
  // isFileRemoved = false;
 

  getCleanFileName(fileName: string): any {
    if (!fileName) {
      // Return a default value or empty string if fileName is not defined
      return '';
    }
  
    const parts = fileName.split('-');
    if (parts.length > 1) {
      return parts.slice(1).join('-'); // Return the filename without the timestamp
    }
    
    return fileName; 
  }
  
  ngOnInit(): void {
    this.employeesForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      salary: [0, [Validators.min(0)]],
      audioFile: [null]
    });
  
    if (this.selectedEmployee) {
      this.employeesForm.patchValue(this.selectedEmployee);
      
      // Extract and store the cleaned filename
      const cleanedFileName = this.getCleanFileName(this.selectedEmployee.audioFile);
      console.log("Cleaned File Name:", cleanedFileName);
      // Display or use the cleaned filename as needed
      this.selectedFile = cleanedFileName;  // This is just for display purposes
      // this.employeesForm.patchValue('audioFile') = this.selectedFile;
      // if (this.selectedEmployee) {
      //   this.employeesForm.patchValue(this.selectedEmployee);
  
        // Set the cleaned file name for display
        this.selectedFileName = this.getCleanFileName(this.selectedEmployee.audioFile);
        // this.selectedFile = this.getCleanFileName(this.selectedEmployee.audioFile);
      // }
      this.employeesForm.get('password')?.clearValidators();
      this.employeesForm.get('password')?.updateValueAndValidity();
    }
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.audioFileValid = this.validateFile(file);
      if (this.audioFileValid) {
        this.selectedFile = null
        this.selectedFileName = file; // Update the filename display
      } else {
        this.selectedFile = null;
        this.selectedFileName = null;
      }
    }
  }
  
  removeFile(): void {
    this.selectedFile = null;
    this.selectedFileName = null;
    this.employeesForm.get('audioFile')?.setValue(null); // Reset the form value
  }
  
  onSubmit() {
    if (this.employeesForm.invalid) {
      this.employeesForm.markAllAsTouched();
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.employeesForm.value).forEach(key => {
      if (key === 'audioFile' && this.selectedFileName) {
        formData.append('audioFile', this.selectedFileName);
      } else {
        formData.append(key, this.employeesForm.value[key]);
      }
    });
  
    if (this.selectedEmployee) {
      this.editEmployee(formData);
    } else {
      this.addEmployee(formData);
    }
  }
  
  validateFile(file: File): boolean {
    const allowedExtensions = ['mp3', 'wav'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return fileExtension ? allowedExtensions.includes(fileExtension) : false;
  }
  addEmployee(formData:any): void {
    this.employeeService.addEmployeeService(formData).subscribe({
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

  editEmployee(formData:any): void {
    this.employeeService.editEmployeeDetails(formData, this.selectedEmployee._id).subscribe({
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
