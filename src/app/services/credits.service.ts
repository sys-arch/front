import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) { }

  getUsersCredits(email: string): Observable<Credits> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': email
    });
  
    return this.http.get<Credits>(`${this.apiUrl}/getcredits`, { headers });
  }  
}