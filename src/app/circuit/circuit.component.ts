import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CircuitService } from '../services/circuit.service';
import { CreditsService } from '../services/credits.service';
import { ManagerService } from '../services/manager.service';
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
  generatedCode: string = "";
  circuitName: string = "";
  credits: number = 0;
  showModal = false;
  modalMessage = ''; 

  constructor(private service: CircuitService, private manager: ManagerService, private router: Router, private creditsService: CreditsService) { 
    this.inputQubits = 3;
    this.outputQubits = 3;
  }
  ngOnInit(): void {
    this.getCredits();
  }

  getCredits() {
    const token = this.manager.token;
    console.log(token)
    const decoded = this.decodeTokenPayload(token);
    const email = decoded?.sub;

    if (!email) {
      console.error("No se pudo obtener el email del token.");
      return;
    }

    this.creditsService.getUsersCredits(email).subscribe({
    
      next: (response: any) => {
        console.log("Creditos:" + response.credits)
        this.credits = response.credits;
      },
      error: (err) => {
        this.openModal('Error al obtener los créditos');
      }
    });
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
  }
  

  negate(row: number, col: number) {
    if (this.matrix) {
      this.matrix.values[row][col] = this.matrix.values[row][col] === 0 ? 1 : 0;
    }
  }

  generatecode() {

    const token = this.manager.token;
    console.log(token);
    const decoded = this.decodeTokenPayload(token);
    const email = decoded?.sub;
    console.log(email);

    if (!this.matrix) {
      this.openModal('La matriz no ha sido construida todavía');
      return;
    }
    

    this.service.generatecode(this.outputQubits, token, this.matrix!).subscribe({
      next: (response: any) => {
        if(this.outputQubits > 6){
          this.creditsService.deductCredit(email).subscribe({
            next: () => {
              this.getCredits();
              this.generatedCode = response.code;

            },
            error: (err) => {
              this.openModal('Error al descontar el crédito');
            }
          });
        } else {
            this.generatedCode = response.code;
        }
        
      },
      error: (err) => {
        this.openModal('Error al generar el código');
      }
    });
  }


  saveCode() {
    if ((this.outputQubits + this.inputQubits) <= 6) {
      this.openModal('Error. No se puede guardar un código de 6 qubits o menos');
      return;
    } 

    if (!this.matrix || !this.generatedCode) {
      this.openModal('Primero debes generar el código');
      return;
    }

    
    if (!this.circuitName.trim()) {
      this.openModal('Debes introducir un nombre para el circuito antes de generar el código');
      return;
    }


    const token = this.manager.token;
    console.log(token);
    const decoded = this.decodeTokenPayload(token);
    const email = decoded?.sub;
    console.log(email);


    if (!email) {
      this.openModal('Error. No se ha podido obtener el email');
      return;
    } 

    const circuitToSave = {
      userEmail: email, 
      name: this.circuitName,
      outputQubits: this.outputQubits,
      table: this.matrix.values,
      code: this.generatedCode,
    };


  
    this.service.saveCodeToDB(circuitToSave).subscribe({
      next: () => {
        alert("Circuito guardado correctamente.");

        

        this.generatecode();
      },
      error: () => {
        this.openModal('Error al guardar el circuito');

      }
    });
  }

  showMatrixModal: boolean = false;

toggleMatrixModal() {
  this.showMatrixModal = !this.showMatrixModal;
}
logout(): void {
    this.manager.token = '';
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
private decodeTokenPayload(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Error al decodificar el token:", e);
    return null;
  }
}

openModal(message: string) {
  this.modalMessage = message;
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
}

}
