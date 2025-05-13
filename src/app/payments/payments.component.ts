import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PaymentsService } from '../services/payments.service';

//declare let Stripe : any;

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'] // <- ojo con "styleUrl" → debe ser "styleUrls" (plural)
})
export class PaymentsComponent implements OnInit {

  matches : number = 30
  transactionId?: string;
  stripePromise: Promise<Stripe | null>;

  constructor(private paymentsService: PaymentsService) {
    // Clave pública de Stripe
    this.stripePromise = loadStripe("pk_test_51R3dbM4U1X4tsPy7Wt3zgFmRH3PikvpeZwHSzi3RAlzd8s0P4lfNr6EpPXOqAIDP7ZjZ3KUFuoOL9Q2kW5Bi6gjk00o3lL2W7z");
  }

  async ngOnInit(): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error("Stripe no se pudo inicializar");
    }
  }

  prepay() {
    this.paymentsService.prepay().subscribe({
      next: (response: any) => {
        alert(response.body);
      },
      error: (response: any) => {
        alert(response);
      }
    });
  }

  confirm(matches: number) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert("Token de sesión no encontrado.");
      return;
    }
  
    this.paymentsService.confirm(token, matches).subscribe({
      next: (response: any) => {
        alert("Confirmación exitosa");
      },
      error: (response: any) => {
        alert("Error en la confirmación: " + JSON.stringify(response));
      }
    });
  }
  
  async pay() {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error("Stripe no se pudo inicializar");
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      alert("Token de sesión no encontrado.");
      return;
    }

    this.paymentsService.pay(token).subscribe({
      next: (response: any) => {
        const sessionId = response.body;
        stripe.redirectToCheckout({ sessionId });
      },
      error: (response: any) => {
        alert("Error en el pago: " + JSON.stringify(response));
      }
    });
  }
}