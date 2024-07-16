import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:3000/api/booking';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, bookingData, { headers: this.getHeaders() });
  }

  verifyBooking(bookingId: string, verificationCode: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify/${bookingId}`, {
      headers: this.getHeaders(),
      params: { verificationCode }
    });
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`, { headers: this.getHeaders() });
  }
}