import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'https://plana-ehci.onrender.com/api/event';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
  }

  createEvent(eventData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, eventData, { headers: this.getHeaders() });
  }

  getAllEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getEvent(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${eventId}`);
  }

  updateEvent(eventId: string, eventData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${eventId}`, eventData, { headers: this.getHeaders() });
  }

  getEventsByCategory(categoryId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/${categoryId}`);
  }

  getEventsByManager(managerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/manager/${managerId}`);
  }

  getEventsByLocation(location: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/location/${location}`, { headers: this.getHeaders() });
  }

  updateEventPoster(eventId: string, posterData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-poster/${eventId}`, posterData, { headers: this.getHeaders() });
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${eventId}`, { headers: this.getHeaders() });
  }
}