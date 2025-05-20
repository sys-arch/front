import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Credits {
  id: number;
  userId: string;
  credits: number;
}

@Injectable({
  providedIn: 'root'
})

export class CreditsService {
  private baseUrl = environment.usersUrl;

  constructor(private http: HttpClient, private manager: ManagerService) { }

  getUsersCredits(email: string): Observable<Credits> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.manager.token}`
  });

  return this.http.get<Credits>(`${this.baseUrl}/credits/getcredits/${encodeURIComponent(email)}`, { headers });
}
  
  deductCredit(email: string) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.manager.token}`
  });

  return this.http.post(`${this.baseUrl}/deductcredits/${email}?amount=1`, null, {
    headers,
    responseType: 'text' as 'json'
  });
}

}