import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8001'; // Cambia esto si el backend está en otra URL

  constructor(private http: HttpClient, private router: Router, public manager: ManagerService) {}


  // Login
  login(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/users/login`, user, { headers }).pipe(
      catchError(error => throwError(() => error))
    );
  }


  // Guardar token
  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  // Metodo para registrar un usuario
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

    return this.http.post(`${this.apiUrl}/users/register`, info, { headers });
}

  

  // Obtener token
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Verificar autenticación
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Cerrar sesión
  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Validar token JWT
  validateToken(): Observable<any> {
    const url = `${this.apiUrl}/tokens/validarToken`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  // Restablecer contraseña (POST con token, nueva pwd y confirmación)
  resetPassword(data: { token: string, newPassword: string, confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/pwd/reset`, data, {
      responseType: 'text'
    });
  }

  // Solicitar reenvío del enlace de restablecimiento
  forgotPassword(email: string): Observable<any> {
    const body = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/pwd/forgot`, body, {
      responseType: 'text'
    });
  }

  // Validar que el token recibido es válido (GET)
  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pwd/reset?token=${token}`);
  }
}
