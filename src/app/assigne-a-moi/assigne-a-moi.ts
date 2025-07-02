import { Component, OnInit } from '@angular/core';
import { MyTicketService } from '../mytickets/myticket.service';
import { Ticket } from '../mytickets/myticket.service';  // <-- Assure-toi que ce chemin est correct
import { CommonModule, NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-assigne-a-moi',
  templateUrl: './assigne-a-moi.html',
  styleUrls: ['./assigne-a-moi.css'],
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf]
})
export class AssigneAMoiComponent implements OnInit {

  tickets: Ticket[] = [];

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
