import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Matrix } from '../circuit/Matrix';
import { __values } from 'tslib';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CircuitService {

  private baseUrl = environment.circuitsUrl;

  constructor(private http: HttpClient) { }

  generatecode(outputQubits: number, token: string, matrix?: Matrix | undefined) {
    let body = {
      outputQubits: outputQubits,
      table: matrix?.values,
    }

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    }
    return this.http.post(`${this.baseUrl}/circuits/generate?credits=true`, body, { headers });

    
  }
  
  saveCodeToDB(circuit: any) {
    return this.http.post(`${this.baseUrl}/circuits/savecode`, circuit);
  }

  getMyCircuits(token: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    };
  
    return this.http.get<any[]>(`${this.baseUrl}/circuits/my-circuits`, { headers });
  }  
  
  
}
