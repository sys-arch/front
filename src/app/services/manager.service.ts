import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  token: string;

  constructor() {
    this.token = sessionStorage.getItem('token') || ''; // <- evita null
  }
}
