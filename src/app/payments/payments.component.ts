import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../services/payments.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {

  transactionId? : string
  //stripe = Stripe("pk_test_51Id...BHC")
  stripe!: Stripe | null;

  constructor(private paymentsService : PaymentsService) { }

 // ngOnInit(): void { }

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe("pk_test_51Id...BHC"); // Carga Stripe de forma asíncrona
  }
  
  prepay() {
    this.paymentsService.prepay().subscribe({
    
      next : (response : any) => {
      alert(response.body)
    },

    error : (response : any) => {
      alert(response)
    }
  })
  }
  }