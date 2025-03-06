import { Component } from '@angular/core';
import { Matrix } from './Matrix';
import { CircuitService } from '../circuit.service';

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

  constructor(private service: CircuitService) {
    this.inputQubits = 3;
    this.outputQubits = 3;
  }
  
  buildMatrix() {
    this.matrix = new Matrix(this.inputQubits, this.outputQubits);
  }

  negate(row: number, col: number) {
    if (this.matrix) {
      this.matrix.values[row][col] = this.matrix.values[row][col] === 0 ? 1 : 0;
    }
  }

  generatecode() {
    this.service.generatecode(this.outputQubits, this.matrix).subscribe({
      next: (response) => {
        console.log("Todo ha ido bien");
      },
      error: (err) => {
        console.log("Ha habido un error");
      }
    });
  }

}
