import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private client: HttpClient) {}

  prepay(): Observable<Object> {
    return this.client.get("http://localhost:8003/payments/prepay", {
      withCredentials: true,
      observe: "response",
      responseType: "text"
    });
  }

  confirm(token: string, credits: number): Observable<Object> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { credits };

    return this.client.put("http://localhost:8003/payments/confirm", body, {
      headers,
      withCredentials: true,
      observe: "response",
      responseType: "text"
    });
  }
}
