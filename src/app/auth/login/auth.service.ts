import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface UserResponse {
  userId: number;
  email: string;
  nom: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7224/api/Users';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; motdepasse: string }): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  get user(): UserResponse | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
