import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { Observable } from 'rxjs';

interface Credits {
  id: number;
  userId: string;
  credits: number;
}

@Injectable({
  providedIn: 'root'
})

export class CreditsService {
  private apiUrl = 'http://localhost:8001/credits';

  constructor(private http: HttpClient, private manager: ManagerService) { }

  getUsersCredits(email: string): Observable<Credits> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': email
    });
  
    return this.http.get<Credits>(`${this.apiUrl}/getcredits`, { headers });
  }
  
  deductCredit(email: string) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.manager.token}`
  });

  return this.http.post(`${this.apiUrl}/deductcredits/${email}?amount=1`, null, {
    headers,
    responseType: 'text' as 'json'
  });
}

}