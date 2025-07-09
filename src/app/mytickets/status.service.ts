// status.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Statut {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatutService {
  private apiUrl = 'https://localhost:7224/api/Statut';

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<Statut[]> {
    return this.http.get<[Statut]>(this.apiUrl);
  }
}
