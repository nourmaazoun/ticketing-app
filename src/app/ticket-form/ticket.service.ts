import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  title: string;
  description: string;
  category: string;
  priority: string;
  requester: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  getTickets() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://localhost:7224/api/Tickets';

  constructor(private http: HttpClient) {}

  createTicket(ticket: Ticket): Observable<any> {
    return this.http.post(this.apiUrl, ticket);
  }
}
