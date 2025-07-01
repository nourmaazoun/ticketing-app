import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // 👈 important !

interface Ticket {
  id: number;
  titre: string;
  description: string;
  employeId: number;
}

@Component({
  selector: 'app-assigne-a-moi',
  templateUrl: './assigne-a-moi.html',
  standalone: true,
  imports: [CommonModule], // ✅ ajoute ici
})
export class AssigneAMoiComponent implements OnInit {
  tickets: Ticket[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      this.tickets = [];
      return;
    }
    const userId = Number(userIdStr);

    this.http.get<Ticket[]>(`https://localhost:7224/api/tickets/by-user/${userId}`)
      .subscribe({
        next: (data) => this.tickets = data,
        error: (err) => {
          console.error('Erreur récupération tickets:', err);
          this.tickets = [];
        }
      });
  }
}
