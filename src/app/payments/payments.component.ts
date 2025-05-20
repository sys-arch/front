import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { PaymentsService } from '../services/payments.service';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {



  matches: number = 30;
  transactionId?: string; // client_secret de Stripe
  stripePromise: Promise<Stripe | null>;
  stripe: Stripe | null = null;
  elements?: StripeElements;
  card?: StripeCardElement;
  message = '';
  

constructor(private paymentsService: PaymentsService, private cd: ChangeDetectorRef) {
    this.stripePromise = loadStripe("pk_test_51R3dbM4U1X4tsPy7Wt3zgFmRH3PikvpeZwHSzi3RAlzd8s0P4lfNr6EpPXOqAIDP7ZjZ3KUFuoOL9Q2kW5Bi6gjk00o3lL2W7z");
  }

  async ngOnInit() {
    this.stripe = await this.stripePromise;
    if (!this.stripe) {
      return;
    }
    this.elements = this.stripe.elements();
  }

  async prepay() {
  this.paymentsService.prepay(this.matches).subscribe({
    next: async (response: any) => {
      this.transactionId = response.body;
      this.message = "Introduce los datos de tu tarjeta para completar el pago.";

      // Fuerza detección de cambios para que *ngIf dibuje el div
      this.cd.detectChanges();

      // Espera a que Angular renderice el DOM
      await new Promise(resolve => setTimeout(resolve, 0));

      const div = document.getElementById("card-element");
      console.log("DIV card-element existe:", div);

      if (this.elements && div) {
        if (this.card) {
          this.card.unmount();
        }
        this.card = this.elements.create("card");
        this.card.mount("#card-element");
      } else {
        this.message = "Error: no se encontró el div para Stripe.";
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
