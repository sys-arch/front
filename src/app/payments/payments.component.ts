import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PaymentsService } from '../services/payments.service';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'] // <- ojo con "styleUrl" → debe ser "styleUrls" (plural)
})
export class PaymentsComponent implements OnInit {

  transactionId?: string;
  stripePromise: Promise<Stripe | null>;

  constructor(private paymentsService: PaymentsService) {
    // Clave pública de Stripe
    this.stripePromise = loadStripe("pk_test_51Id...BHC");
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
}