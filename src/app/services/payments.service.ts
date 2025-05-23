import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private baseUrl = environment.paymentsUrl;

  constructor(private client: HttpClient) {}

  prepay(credits: number): Observable<Object> {
    return this.client.post(`${this.baseUrl}/payments/prepay`, { credits }, {
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

    return this.client.put(`${this.baseUrl}/payments/confirm`, credits, {
      headers,
      withCredentials: true,
      observe: "response",
      responseType: "text"
    });
  }


  pay(token: string): Observable<Object> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.client.post(``, {}, {
    headers,
    withCredentials: true,
    observe: "response",
    responseType: "text"
  });
}

}
