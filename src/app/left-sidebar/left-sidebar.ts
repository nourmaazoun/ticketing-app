import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.html',
  styleUrls: ['./left-sidebar.css'], // corrigé de styleUrl -> styleUrls
})
export class LeftSidebarComponent {
  @Input() isLeftSidebarCollapsed!: boolean;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();

  items = [
    { routeLink: '/ticket-form', icon: 'fal fa-plus', label: 'Créer un ticket' },
    { routeLink: '/mytickets', icon: 'fal fa-ticket-alt', label: 'Les Tickets' },
    { routeLink: '/assigne-a-moi', icon: 'fal fa-user-check', label: 'Assigné à moi' }  // <-- ajouté ici
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed);
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
