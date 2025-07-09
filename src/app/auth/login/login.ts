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
  next: (response) => {
    console.log("🧾 Données de l'utilisateur connecté :", response);

    // Vérifie que userId existe et est un nombre
    if (response && typeof response.userId === 'number') {
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('userId', response.userId.toString()); // ✅ on utilise userId ici
      this.router.navigate(['/dashboard']); // ou autre page de redirection
    } else {
      console.error("❌ 'userId' manquant ou invalide dans la réponse :", response);
    }
  },
  error: (err) => {
    console.error("❌ Erreur de connexion :", err);
  }
});


  }
}
