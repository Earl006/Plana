// src/app/services/notification-chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationChatService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications`);
  }

  getChatRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chatrooms`);
  }

  sendMessage(roomId: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chatrooms/${roomId}/messages`, { message });
  }
}
