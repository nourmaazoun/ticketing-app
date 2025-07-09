import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../login/auth.service';  // adapte si besoin

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      // Redirige vers une page d'erreur ou login
      this.router.navigate(['/not-found']);  // ou '/login'
      return false;
    }
  }
}
