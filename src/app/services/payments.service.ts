import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class PaymentsService {

  constructor(private client : HttpClient) { }

  prepay() : Observable<Object> {
return this.client.get("http://localhost:8003/payments/prepay", {
  withCredentials: true,
  observe: "response",
  responseType: "text"
});
}
}