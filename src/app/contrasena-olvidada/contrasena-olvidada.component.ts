import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-contrasena-olvidada',
  standalone: false,
  templateUrl: './contrasena-olvidada.component.html',
  styleUrl: './contrasena-olvidada.component.css'
})
export class ContrasenaOlvidadaComponent {
  email: string = '';  // Almacena el correo electrónico ingresado por el usuario
  isLoading: boolean = false;  // Controla el estado de "loading"
  emailInvalid: boolean = false;  // Controla si el formato del email es inválido
  emailSent: boolean = false;  // Controla si se ha enviado el correo correctamente
  errorMessage: string = '';  // Almacena mensajes de error
  showResetMessage: boolean = false;  // Muestra un mensaje de éxito al restablecer la contraseña

  // Expresiones regulares y configuraciones de validación
  private readonly emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly injectionPattern: RegExp = /(\r|\n|%0a|%0d|%0A|%0D)/;
  private readonly blacklistDomains: string[] = [
    'mailinator.com',
    '10minutemail.com',
    'guerrillamail.com',
    'yopmail.com',
    'getnada.com',
    'temp-mail.org',
    'dispostable.com',
    'trashmail.com',
    'fakeinbox.com',
    'tempmailaddress.com'
  ];

  constructor(
    private router: Router,
    private userService: UserService,  // Simula el servicio de usuario para manejar el envío
  ) {}

  // Valida el correo electrónico con todas las comprobaciones
  validateEmail(): boolean {
    this.resetEmailValidationStates(); // Restablece los estados de validación
    
    if (this.email.trim() === '') {
      this.emailInvalid = true;
      return false;
    }

    // 1. Validar formato del correo electrónico
    if (!this.emailPattern.test(this.email)) {
      this.emailInvalid = true;
      console.error('El correo electrónico no tiene un formato válido.');
      return false;
    }

    // 2. Validar si contiene caracteres de inyección
    if (this.injectionPattern.test(this.email)) {
      this.emailInvalid = true;
      console.error('El correo electrónico contiene caracteres maliciosos.');
      return false;
    }

    // 3. Validar si el dominio del correo está en la lista negra
    const domain = this.email.split('@')[1];
    if (domain && this.blacklistDomains.includes(domain)) {
      this.emailInvalid = true;
      return false;
    }

    return true;  // El correo es válido
  }




  // Método para redirigir a las diferentes páginas
  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }

  // Resetear validaciones de email
  private resetEmailValidationStates(): void {
    this.emailInvalid = false;
  }
  passwordResetAttempt(event: Event): void {
    event.preventDefault(); // Evita que se recargue la página
  
    if (!this.email) {
      alert("Por favor, introduce un correo electrónico.");
      return;
    }
  
    this.userService.forgotPassword(this.email).subscribe({
      next: () => {
        this.showResetMessage = true;
      }
     
    });
  }
  
}