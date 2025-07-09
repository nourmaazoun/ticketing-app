import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MyTicketService, Ticket } from './myticket.service';
import { EmployeService, Employe } from '../mytickets/employe.service';
import { FormsModule } from '@angular/forms'; // adapte le chemin

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
  ],
  templateUrl: './mytickets.html',
  styleUrls: ['./mytickets.css']
})
export class MyTicketsComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'description',
    'category',
    'priority',
    'requester',
    'userName',
    'status',
    'assignedTo',
    'attachmentPath', 
  

  ];

  dataSource: Ticket[] = [];
  employees: Employe[] = []; // Liste des employés récupérée

  constructor(
    private ticketService: MyTicketService,
    private employeService: EmployeService
  ) {}
ngOnInit(): void {
 this.ticketService.getTickets().subscribe({
  next: (data) => {
    console.log('Réponse brute API tickets:', data);
    this.dataSource = data.map(ticket => ({
      ...ticket,
      status: ticket.statut || 'ouvert',
      assignedTo: ticket.assignedTo ?? '',
      attachmentPath: ticket.attachmentPath ?? null
    }));
  },
  error: (err) => {
    console.error('Erreur lors du chargement des tickets', err);
  }
});




    // Charger les employés
    this.employeService.getEmployes().subscribe({
      next: (emps) => {
        this.employees = emps;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des employés', err);
      }
    });
  }

 onStatutChange(ticketId: number, newStatut: string) {
  this.ticketService.updateStatut(ticketId, newStatut).subscribe({
    next: () => {
      console.log('Statut mis à jour !');
      // Trouver le ticket dans dataSource et mettre à jour son statut localement
      const ticket = this.dataSource.find(t => t.id === ticketId);
      if (ticket) {
        ticket.status = newStatut;  // ou 'statut' selon ta propriété
      }
    },
    error: (err) => {
      console.error('Erreur mise à jour statut :', err);
    }
  });
}

onAssigneeChange(ticket: Ticket) {
  if (ticket.assignedToId != null) {
    this.ticketService.assignTicket(ticket.id, ticket.assignedToId).subscribe({
      next: () => {
        console.log('✅ Ticket assigné en base');
      },
      error: (err) => {
        console.error('❌ Erreur assignation', err);
      }
    });
  } else {
    console.warn('Aucun employé sélectionné pour le ticket :', ticket.title);
  }
}
isImageFile(path: string): boolean {
  return !!path && (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif'));
}

}