// src/app/services/category.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/api/category';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });
  }

  createCategory(categoryData: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, categoryData, { headers: this.getHeaders() });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getCategoryById(categoryId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${categoryId}`);
  }

  updateCategory(categoryId: string, categoryData: { name: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${categoryId}`, categoryData, { headers: this.getHeaders() });
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${categoryId}`, { headers: this.getHeaders() });
  }
}