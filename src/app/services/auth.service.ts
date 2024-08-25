import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // Replace with real authentication logic
    if (username === 'user' && password === 'password') {
      this.isAuthenticated = true;
      this.router.navigate(['/employee-list']);
      return true;
    }
    return false;
  }

  register(username: string, password: string): boolean {
    // Replace with real registration logic
    this.isAuthenticated = true;
    this.router.navigate(['/employee-list']);
    return true;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}

