// status.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Status {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private apiUrl = 'https://localhost:7224/api/Status';

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(this.apiUrl);
  }
}
