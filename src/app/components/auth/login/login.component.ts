import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
  export class LoginComponent implements OnInit {
    fb = inject(FormBuilder);  // Inject FormBuilder
    router = inject(Router);  // Inject Router
    http = inject(HttpClient);  // Inject HttpClient
    loginForm!: FormGroup;
  
    ngOnInit() {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required,Validators.minLength(6)]]
      });
    }
  
    login() {
      if (this.loginForm.valid) {
        const formData = this.loginForm.value;
        // Handle login logic here, such as calling an API via http.post()
        console.log('Form Submitted:', formData);
        this.router.navigate(['/employee-list']);
      }
    }

    navigateToRegister(): void {
      this.router.navigate(['/register']);
    }
  }

