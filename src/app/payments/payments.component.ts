import { Component } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { PaymentsService } from '../services/payments.service';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {



  matches: number = 30;
  transactionId?: string; // client_secret de Stripe
  stripePromise: Promise<Stripe | null>;
  stripe: Stripe | null = null;
  elements?: StripeElements;
  card?: StripeCardElement;
  message = '';

  constructor(private paymentsService: PaymentsService) {
    this.stripePromise = loadStripe("pk_test_51R3dbM4U1X4tsPy7Wt3zgFmRH3PikvpeZwHSzi3RAlzd8s0P4lfNr6EpPXOqAIDP7ZjZ3KUFuoOL9Q2kW5Bi6gjk00o3lL2W7z");
  }

  async ngOnInit() {
    this.stripe = await this.stripePromise;
    if (!this.stripe) {
      console.error("Stripe no se pudo inicializar");
      return;
    }
    this.elements = this.stripe.elements();
  }

  prepay() {
    this.paymentsService.prepay().subscribe({
      next: (response: any) => {
        this.transactionId = response.body; // client_secret
        this.message = "Introduce los datos de tu tarjeta para completar el pago.";

        // Montamos Stripe Elements solo si no está ya montado
        if (this.elements && !this.card) {
          this.card = this.elements.create("card");
          this.card.mount("#card-element");
        }
      },
      error: (err) => {
        this.message = "Error en prepay";
        console.error(err);
      }
    });
  }

  async pay() {
    if (!this.stripe || !this.card || !this.transactionId) return;

    const result = await this.stripe.confirmCardPayment(this.transactionId, {
      payment_method: {
        card: this.card
      }
    });

    if (result.error) {
      this.message = "Error en el pago: " + result.error.message;
    } else if (result.paymentIntent?.status === 'succeeded') {
      this.message = "Pago exitoso. Confirmando...";

      const token = sessionStorage.getItem('token');
      if (token) {
        this.paymentsService.confirm(token, this.matches).subscribe({
          next: () => this.message += " Confirmación OK.",
          error: (e) => this.message += " Pero hubo un error al confirmar: " + JSON.stringify(e)
        });
      }
    }
  }
}
