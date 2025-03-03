import { Component } from '@angular/core';
import { Matrix } from './Matrix';

@Component({
  selector: 'app-circuit',
  standalone: false,
  templateUrl: './circuit.component.html',
  styleUrl: './circuit.component.css'
})
export class CircuitComponent {
  inputQubits: number = 1;
  outputQubits: number = 1;
  matrix?: Matrix;

  constructor() {
    this.inputQubits = 3;
    this.outputQubits = 3;
  }
  
  buildMatrix() {
    this.matrix = new Matrix(this.inputQubits, this.outputQubits);
  }
}
