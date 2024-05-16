import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  authService = inject(AuthService);
  router = inject(Router);
  isAuthenticated = false;

  login(event: Event) {
    event.preventDefault();
    console.log(`Login: ${this.username} / ${this.password}`);
    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe(() => {
        alert('Login success!');
        this.isAuthenticated=true;
        this.router.navigate(['/dashboard']);
      });
  }



}
