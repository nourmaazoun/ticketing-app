import { Component, HostListener, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { TicketFormComponent } from './ticket-form/ticket-form';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar';
import { LoginComponent } from './auth/login/login';

import { AuthService } from './auth/login/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    TicketFormComponent,
    LeftSidebarComponent,
    LoginComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  constructor(private auth: AuthService, private router: Router) {}

  get userName(): string {
    return this.auth.user?.nom ?? '';
  }

  // Ajout de la propriété isLoggedIn pour vérifier l'état de connexion
  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  ngOnInit(): void {
    this.updateLayout(window.innerWidth);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateLayout(event.target.innerWidth);
  }

  private updateLayout(width: number): void {
    this.screenWidth.set(width);
    this.isLeftSidebarCollapsed.set(width < 768);
  }
}
