import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employe {
  id: number;
  nom: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private apiUrl = 'https://localhost:7224/api/Users/employes';

  constructor(private http: HttpClient) {}

  getEmployes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.apiUrl);
  }
}
