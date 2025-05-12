import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ManagerService } from './services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private manager: ManagerService, private router: Router) {}

  canActivate(): boolean {
    if (this.manager.token && this.manager.token.trim() !== '') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
