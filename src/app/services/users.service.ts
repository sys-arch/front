import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.usersUrl;

  constructor(private http: HttpClient, private router: Router, public manager: ManagerService) {}

  login(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/users/login`, user, { headers }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  register(
    email: string,
    password1: string,
    password2: string,
    nombre: string,
    apellido: string,
    apellido2: string,

): Observable<any> {
  console.log('Registering user:', email, password1, password2, nombre, apellido, apellido2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const info = {
        email: email,
        pwd1: password1,
        pwd2: password2,
        nombre: nombre,
        apellido1: apellido,
        apellido2: apellido2,
    };

    return this.http.post(`${this.baseUrl}/users/register`, info, { headers });
}

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  validateToken(): Observable<any> {
    const url = `${this.baseUrl}/tokens/validarToken`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  resetPassword(data: { token: string, newPassword: string, confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/pwd/reset`, data, {
      responseType: 'text'
    });
  }

  forgotPassword(email: string): Observable<any> {
    const body = new HttpParams().set('email', email);
    return this.http.post(`${this.baseUrl}/pwd/forgot`, body, {
      responseType: 'text'
    });
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pwd/reset?token=${token}`);
  }
}
