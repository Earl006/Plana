import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  changePassword(changePasswordRequest: any, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, changePasswordRequest, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  requestPasswordReset(email: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, email, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  resetPassword(resetPasswordRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, resetPasswordRequest, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  getUserId(): string | null {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
}
function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}

