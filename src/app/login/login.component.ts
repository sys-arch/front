import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerService } from '../services/manager.service';
import { UserService } from '../services/users.service';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})
export class LoginComponent {
  
  username: string = '';
  password: string = '';
  passwordVisible = false;
  emailInvalid = false;
  loginFailed = false;
  isLoading = false;
  twoFactorEnabled = false;

  passwordInvalid = false;
  domainInvalid = false;
  errorMessage: string = '';
  loginAttempts = 0;
  isBlocked = false;
  blockTimeout: any;
  blockDuration = 2 * 60 * 1000; // 2 minutos en milisegundos

  @ViewChild('loginForm') loginForm!: NgForm;
  
  private readonly emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly injectionPattern: RegExp = /(\r|\n|%0a|%0d|%0A|%0D)/;
  private readonly minPasswordLength: number = 8;
  private readonly blacklistDomains: string[] =  [
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
    constructor(private router: Router, private userservice: UserService, private manager: ManagerService) {}
    ngOnInit(): void {
  }

   // Método de inicio de sesión que llama al servicio `UserService`
loginAttempt(): void {
  if (this.isBlocked) {
    console.log('Demasiados intentos. Inténtalo de nuevo en unos minutos.');
    return; // NO hacemos loginFailed = true
  }

  this.resetValidationStates();
  this.onEmailChange();
  this.validatePassword();

  if (!this.emailInvalid && !this.passwordInvalid && !this.domainInvalid) {
    const user = {
      email: this.username,
      pwd: this.password
    };

    this.userservice.login(user).subscribe({
      next: (response) => {
        if (response.token) {
          this.resetLoginAttempts(); // ✅ Resetea el contador en login exitoso
          this.userservice.saveToken(response.token);
          console.log("Token guardado correctamente");
          this.manager.token = response.token;
          sessionStorage.setItem('token', response.token);
          this.router.navigate(['/circuit']);
        } else {
          console.error('No se recibió un token de autenticación.');
          this.handleFailedAttempt(); // ✅ Cuenta fallo
        }
      },
      error: (error) => {
        console.error("Error en el login:", error);
        this.handleFailedAttempt(); // ✅ Cuenta fallo
      }
    });

  } else {
    this.handleFailedAttempt(); // ✅ Cuenta fallo de validación
  }
}

  private handleFailedAttempt(): void {
    this.loginAttempts++;
    if (this.loginAttempts < 3) {
      this.loginFailed = true; // solo antes del bloqueo
    }

    if (this.loginAttempts >= 3) {
      this.isBlocked = true;
      console.log('Usuario bloqueado por demasiados intentos fallidos. Esperando 2 minutos.');
      this.blockTimeout = setTimeout(() => {
        this.isBlocked = false;
        this.loginAttempts = 0;
        console.log('Fin del bloqueo. El usuario puede volver a intentar iniciar sesión.');
      }, this.blockDuration);
    } else {
      this.errorMessage = 'Inicio de sesión no exitoso. Verifique sus credenciales.';
    }
  }
private resetLoginAttempts(): void {
  this.loginAttempts = 0;
  this.isBlocked = false;
  if (this.blockTimeout) {
    clearTimeout(this.blockTimeout);
  }
}


  navigateToResetPassword(): void {
    this.router.navigate(['/contrasena-olvidada']);
  }
  

  // Validar que el correo electrónico ingresado tenga un formato válido cada vez que cambie
  onEmailChange(): void {
    this.resetEmailValidationStates(); // Restablecer estados de validación de email al cambiar
    if (this.username.trim() === '') {
      this.emailInvalid = false;
      return;
    }

    // Validar el formato del correo electrónico
    if (!this.emailPattern.test(this.username)) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico no tiene un formato válido.';
      return;
    }

    // Validar si el correo contiene caracteres de inyección
    if (this.injectionPattern.test(this.username)) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico contiene caracteres maliciosos.';
      return;
    }

    // Validar la longitud máxima del correo (320 caracteres)
    if (this.username.length > 320) {
      this.emailInvalid = true;
      this.errorMessage = 'El correo electrónico es demasiado largo.';
      return;
    }

    // Validar si el dominio del correo está en la lista negra
    const domain = this.username.split('@')[1];
    if (domain && this.blacklistDomains.includes(domain)) {
      this.emailInvalid = true;
      this.errorMessage = `El dominio ${domain} no está permitido.`;
      return;
    }
  }

  // Validar la seguridad de la contraseña
  validatePassword(): void {

    // Longitud mínima de la contraseña
    if (this.password.length < this.minPasswordLength) {
        this.passwordInvalid = true;
        this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
        return;
    }

    // Validar si la contraseña contiene caracteres maliciosos
    if (this.injectionPattern.test(this.password)) {
        this.passwordInvalid = true;
        this.errorMessage = 'La contraseña contiene caracteres no permitidos.';
        return;
    }

    this.passwordInvalid = false;  // Asegurar que la validación pase si todo está bien
}


  // Método para mostrar u ocultar la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  // Resetear los estados de error para todas las validaciones
  resetValidationStates(): void {
    this.emailInvalid = false;
    this.passwordInvalid = false;
    this.domainInvalid = false;
    this.loginFailed = false;
    this.errorMessage = '';
  }

  // Resetear solo los estados de validación de email
  resetEmailValidationStates(): void {
    this.emailInvalid = false;
    this.domainInvalid = false;
    this.errorMessage = '';
  }
  


}
