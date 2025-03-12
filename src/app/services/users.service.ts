import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ManagerService } from '../manager.service';



@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8081'; // Cambia esto si el backend está en otra URL

    constructor(private http: HttpClient, private router: Router, public manager: ManagerService) {}

  // Método para enviar credenciales y recibir el token
  login(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/users/login`, user, { headers }).pipe(
        catchError(error => throwError(() => error))
    );
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

  // Guardar el token en sessionStorage
    saveToken(token: string): void {
        sessionStorage.setItem('token', token);
        this.manager.token = token;
    }

    // Obtener el token
    getToken(): string | null {
        return sessionStorage.getItem('token');
    }

  // Verificar si hay un usuario autenticado
    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

  // Cerrar sesión
    logout(): void {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

  // Método para verificar si el token es válido
    validateToken(): Observable<any> {
        const url = `${this.apiUrl}/tokens/validarToken`;
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
        });
        return this.http.get(url, { headers });
    }
}
