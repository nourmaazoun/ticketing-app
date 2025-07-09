import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Ticket {
  id?: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  requester: string;
  userName: string;
  attachmentPath?: string;
  statut?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7224/api/Tickets';

  constructor(private http: HttpClient) { }

  createTicket(ticketData: Partial<Ticket>, file?: File): Observable<Ticket> {
    const formData = new FormData();

    // Conversion des noms de champs pour correspondre au backend
    const fieldMappings = {
      title: 'Title',
      description: 'Description',
      category: 'Category',
      priority: 'Priority',
      requester: 'Requester',
      userName: 'UserName'
    };

    Object.entries(ticketData).forEach(([key, value]) => {
      const backendFieldName = fieldMappings[key as keyof typeof fieldMappings] || key;
      formData.append(backendFieldName, value as string);
    });

    if (file) {
      formData.append('File', file, file.name);
    }

    return this.http.post<Ticket>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur du service Ticket:', error);
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur';
    }

    return throwError(() => new Error(errorMessage));
  }
}