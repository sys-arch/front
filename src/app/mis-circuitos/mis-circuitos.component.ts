import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CircuitService } from '../services/circuit.service';
import { ManagerService } from '../services/manager.service';

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

  constructor(private service: CircuitService, private router: Router, private manager: ManagerService) {}

  
  ngOnInit(): void {
    const token = sessionStorage.getItem('token');

    if (token) {
      const decoded = this.decodeTokenPayload(token);
      const email = decoded?.sub;

      this.service.getMyCircuits(email).subscribe({
        next: (response) => {
          this.circuits = response;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
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

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }


  logout(): void {
    this.manager.token = '';
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
}
