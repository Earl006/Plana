import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:3000/api/event';

  constructor(private http: HttpClient) { }

  getEvent(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateEvent(id: string, eventData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/update/${id}`, eventData, { headers });
  }

  updateEventPoster(id: string, poster: File): Observable<any> {
    const formData = new FormData();
    formData.append('poster', poster);
    return this.http.put(`${this.baseUrl}/update-poster/${id}`, formData);
  }
}