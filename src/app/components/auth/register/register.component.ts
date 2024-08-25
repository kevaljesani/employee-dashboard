import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);  // Inject FormBuilder
  router = inject(Router);  // Inject Router
  http = inject(HttpClient);  // Inject HttpClient
  registerForm!: FormGroup;

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      // Handle register logic here, such as calling an API via http.post()
      console.log('Form Submitted:', formData);
      this.router.navigate(['/employee-list']);
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
