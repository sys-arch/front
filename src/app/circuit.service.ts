import { Injectable } from '@angular/core';
import { Matrix } from './circuit/Matrix';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CircuitService {

  constructor(private http: HttpClient) { }

  generatecode(outputQubits: number, matrix?: Matrix | undefined) {
    let body = {
      outputQubits: outputQubits,
      table: matrix
    }
    
    return this.http.post('http://localhost:8080/circuits/generatecode', body)
  }
}
