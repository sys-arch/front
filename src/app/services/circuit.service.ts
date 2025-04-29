import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Matrix } from '../circuit/Matrix';

@Injectable({
  providedIn: 'root'
})

export class CircuitService {

  constructor(private http: HttpClient) { }

  generatecode(outputQubits: number, token: string, matrix?: Matrix | undefined) {
    let body = {
      outputQubits: outputQubits,
      table: matrix
    }

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    }

    return this.http.post('http://localhost:8080/circuits/generate', body, { headers })
    
  }
  
  saveCodeToDB(circuit: any) {
    return this.http.post('http://localhost:8080/circuits/savecode', circuit);
  }

  getMyCircuits() {
    return this.http.get<any[]>('/api/circuits/me');
  }  
}
