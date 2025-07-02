import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  requester: string;
  userName: string;
  assignedToId?: number;  // Id de l’employé assigné, optionnel si non assigné
  assignedTo?: string;  
  statut: string; // Nom de l’employé assigné, optionnel
}


@Injectable({
  providedIn: 'root'
})
export class MyTicketService {
  private apiUrl = 'https://localhost:7224/api/Tickets';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }
 assignTicket(ticketId: number, employeId: number) {
  return this.http.put(`${this.apiUrl}/${ticketId}/assign/${employeId}`, {});
}
updateStatut(ticketId: number, statut: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/update-statut`, {
    id: ticketId,
    statut: statut
  });
}

  getTicketsByEmploye(employeId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/by-user/${employeId}`);
  }




}
