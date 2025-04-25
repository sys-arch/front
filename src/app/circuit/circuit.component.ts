import { Component } from '@angular/core';
import { CircuitService } from '../services/circuit.service';
import { Matrix } from './Matrix';
import { ManagerService } from '../services/manager.service';

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
  generatedCode: string = "";
  circuitName: string = "";


  constructor(private service: CircuitService, private manager: ManagerService) { 
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

    //let token = sessionStorage.getItem('token');
    let token = this.manager.token;

    if (!this.matrix) {
      console.error("La matriz no ha sido construida aún.");
      return;
    }

    this.service.generatecode(this.outputQubits, token, this.matrix!).subscribe({
      next: (response: any) => {
        console.log("Todo ha ido bien");
        this.generatedCode = response.code;
        
      },
      error: (err) => {
        console.log("Ha habido un error");
      }
    });
  }



  saveCode() {
    if (this.outputQubits < 6) {
      alert("El número de Qubits de salida debe ser al menos 6 para guardar el circuito.");
      return;
    } 

    //añadir comprobación pagos que tenga saldo el usuario

    if (!this.matrix || !this.generatedCode) {
      console.warn("No hay matriz o código generado.");
      alert("Primero debes generar el código.");
      return;
    }
  
    const circuitToSave = {
      name: this.circuitName,
      outputQubits: this.outputQubits,
      table: this.matrix.values,
      code: this.generatedCode
    };
  
    this.service.saveCodeToDB(circuitToSave).subscribe({
      next: () => {
        console.log("Circuito guardado con éxito.");
        alert("Circuito guardado correctamente.");
      },
      error: () => {
        console.log("Error al guardar el circuito.");
        alert("Ocurrió un error al guardar el circuito.");
      }
    });
  }

  showMatrixModal: boolean = false;

toggleMatrixModal() {
  this.showMatrixModal = !this.showMatrixModal;
}


}
