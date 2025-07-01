import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7224/api/Users';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; motdepasse: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }

 get isLoggedIn(): boolean {
  return !!this.user;
}




  get user(): any {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
