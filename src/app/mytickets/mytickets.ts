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
    'assignedTo'
  ];

  dataSource: Ticket[] = [];
  employees: Employe[] = []; // Liste des employés récupérée

  constructor(
    private ticketService: MyTicketService,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {
    // Charger les tickets
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.dataSource = data.map(ticket => ({
          ...ticket,
          status: ticket.status || 'Ouvert',
          assignedTo: ticket.assignedTo || ''
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

  onStatusChange(ticket: Ticket) {
    console.log(`Nouveau statut pour le ticket "${ticket.title}": ${ticket.status}`);
    // Appelle un service pour mettre à jour en base si besoin
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

}
