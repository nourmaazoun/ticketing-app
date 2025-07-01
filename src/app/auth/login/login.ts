import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../login/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  motdepasse = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';
    this.loading = true;

    const credentials = {
      email: this.email,
      motdepasse: this.motdepasse
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        // 👇 stockage dans localStorage comme avant
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('userId', response.id);

        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }
}
