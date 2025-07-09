import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService, RegisterData } from '../register/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  userName = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';

    const newEmploye: RegisterData = {
      Nom: this.userName,
      Email: this.email,
      Motdepasse: this.password,
    };

    this.registerService.register(newEmploye).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = 'Un utilisateur avec cet email existe déjà.';
        } else {
          this.errorMessage = 'Erreur lors de l\'inscription';
        }
      }
    });
  }
}
