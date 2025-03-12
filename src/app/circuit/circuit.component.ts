import { Component } from '@angular/core';
import { CircuitService } from '../services/circuit.service';
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

  constructor(private service: CircuitService) {
    this.inputQubits = 3;
    this.outputQubits = 3;
  }
  ngOnInit(): void {
    
  }
  buildMatrix() {
    const rows = Math.pow(2, this.inputQubits);
    const columns = this.inputQubits + this.outputQubits;
  
    this.matrix = new Matrix(rows, columns);
  
    for (let i = 0; i < rows; i++) {
      const binaryString = i.toString(2).padStart(this.inputQubits, '0');
      
      for (let j = 0; j < this.inputQubits; j++) {
        this.matrix.values[i][j] = Number(binaryString[j]);
      }
  
      for (let j = this.inputQubits; j < columns; j++) {
        this.matrix.values[i][j] = 0;
      }
    }
  
    console.log("Matriz generada:", this.matrix.values);
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
