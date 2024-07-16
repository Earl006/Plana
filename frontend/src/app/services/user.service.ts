import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/email/${email}`, { headers: this.getHeaders() });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all/users`, { headers: this.getHeaders() });
  }
  getManagers(): Observable<any>{
    return this.http.get(`${this.apiUrl}/manager/all`, {headers: this.getHeaders()});
  }
  getManagerRequests(): Observable<any>{
    return this.http.get(`${this.apiUrl}/manager/requests`, {headers: this.getHeaders()});
  }
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getHeaders() });
  }

  requestManagerRole(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-manager`, { userId }, { headers: this.getHeaders() });
  }

  approveManagerRole(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve-manager`, { userId }, { headers: this.getHeaders() });
  }

  rejectManagerRole(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reject-manager`, { userId }, { headers: this.getHeaders() });
  }

  changeRole(userId: string, newRole: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-role`, { userId, newRole }, { headers: this.getHeaders() });
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/u/stats`, { headers: this.getHeaders() });
  }

  searchUsers(searchTerm: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/s/search-users?search=${searchTerm}`, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
