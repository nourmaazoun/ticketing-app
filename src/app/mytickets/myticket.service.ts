import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  requester: string;
  userName: string;
  assignedToId?: number;
  assignedTo?: string;
  statut?: string;  // Ajouté pour correspondre à l'API
  status: string;
  attachmentPath?: string | null; 

}

@Injectable({
  providedIn: 'root'
})
export class MyTicketService {
  private apiUrl = 'https://localhost:7224/api/Tickets';

  constructor(private http: HttpClient) {}

  // 🔹 GET: Tous les tickets
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl).pipe(
      catchError(this.handleError<Ticket[]>('getTickets', []))
    );
  }

  // 🔹 GET: Ticket par ID
  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Ticket>(`getTicket id=${id}`))
    );
  }

  // 🔹 POST: Créer un ticket
  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket).pipe(
      catchError(this.handleError<Ticket>('createTicket'))
    );
  }

  // 🔹 PUT: Assigner un ticket à un employé
  assignTicket(ticketId: number, employeId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}/assign/${employeId}`, {}).pipe(
      catchError(this.handleError<any>('assignTicket'))
    );
  }

  // 🔹 PUT: Mettre à jour le statut
  updateStatut(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-statut`, {
      id: id,
      statut: status // Correspond exactement au DTO .NET
    });
  }


  // 🔹 GET: Tickets assignés à un employé
 getTicketsByEmploye(userId: number): Observable<Ticket[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-user/${userId}`).pipe(
      map(tickets => tickets.map(t => ({
        ...t,
        // Conversion explicite pour Angular
        status: t.statut || t.status || 'ouvert' // 'statut' vient de l'API, 'status' est la propriété Angular
      }))),
      catchError(() => of([]))
    );
  }

  // 🔹 Handler générique des erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
