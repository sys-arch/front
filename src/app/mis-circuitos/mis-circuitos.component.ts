import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CircuitService } from '../services/circuit.service';

@Component({
  selector: 'app-mis-circuitos',
  standalone: false,
  templateUrl: './mis-circuitos.component.html',
  styleUrls: ['./mis-circuitos.component.css']
})
export class MyCircuitsComponent implements OnInit {
  circuits: any[] = [];
  selectedCode: string = '';
  selectedCircuit: any = null;
  loading = true;

  constructor(private service: CircuitService, private router: Router) {}

  ngOnInit(): void {
    // Simulación de circuitos para test visual
    this.circuits = [
      { name: 'Circuito de prueba A', code: 'q0 -> H -> X' },
      { name: 'Circuito de prueba B', code: 'q1 -> X -> H -> Z' },
      { name: 'Circuito de prueba C', code: 'q2 -> H -> CNOT -> M' }
    ];
    this.loading = false;
  
    // Descomenta esto cuando uses datos reales
    /*
    this.service.getMyCircuits().subscribe({
      next: (response) => {
        this.circuits = response;
        this.loading = false;
      },
      error: () => {
        console.log("Error al recuperar circuitos");
        this.loading = false;
      }
    });
    */
  }
  

  // Método para mostrar código desde el desplegable
  onSelectCircuit(event: Event) {
    const selectedCode = (event.target as HTMLSelectElement).value;
    this.selectedCode = selectedCode;
  }

  // Método alternativo si usas la lista de <li> (por si quieres mantenerlo para debug)
  showCode(code: string) {
    this.selectedCode = code;
  }

  goToCreateCircuit() {
    this.router.navigate(['/create-circuit']);
  }
  
}
