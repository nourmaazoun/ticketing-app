import {  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

// Import des modules Material nécessaires
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { MyTicketService } from '../mytickets/myticket.service';
import { Ticket } from '../mytickets/myticket.service';

@Component({
  selector: 'app-assigne-a-moi',
  templateUrl: './assigne-a-moi.html',
  styleUrls: ['./assigne-a-moi.css'],

  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule
  ]
})
export class AssigneAMoiComponent implements OnInit {

  tickets: Ticket[] = [];

  // ✅ Obligatoire pour <mat-header-row *matHeaderRowDef="displayedColumns">
  displayedColumns: string[] = ['title', 'description', 'statut'];

  constructor(private ticketService: MyTicketService) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');

    if (typeof userIdStr !== 'string' || !userIdStr.trim()) {
      console.error("❌ userId introuvable ou vide dans le localStorage !");
      return;
    }

    const userId = Number(userIdStr);

    if (isNaN(userId) || userId <= 0) {
      console.error(`❌ userId n'est pas un nombre valide : ${userIdStr}`);
      return;
    }

    this.ticketService.getTicketsByEmploye(userId).subscribe({
      next: (data) => {
        this.tickets = data;
        console.log("✅ Tickets assignés récupérés :", this.tickets);
      },
      error: (err) => {
        console.error('❌ Erreur récupération tickets:', err);
      }
    });
  }
}
