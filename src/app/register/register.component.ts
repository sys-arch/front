import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/users.service';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_ç<>])[A-Za-z\d@$!%*?&#+\-_ç<>]{8,}$/;
const PASSWORD_ERROR_MESSAGE =
  'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  nombre: string = '';
  apellido: string = '';
  apellido2: string = '';
  email: string = '';
  departamento: string = '';
  centro: string = '';
  fechaAlta: string = '';
  perfilLaboral: string = '';
  password1: string = '';
  password2: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  passwordVisible1 = false;
  passwordVisible2 = false;
  emailInvalid = false;
  fechaInvalid = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  bloqueado = true;
  verificado = false;
  formattedDate: string = '';
  showModal = false;
  modalMessage = ''; 

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  validateFechaAlta(): void {
    this.fechaInvalid = false;
    const alta = new Date(this.fechaAlta);
    const fechaActual = new Date();
    if (alta > fechaActual) {
      this.fechaInvalid = true;
    }
  }

  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailInvalid = !emailPattern.test(this.email);
  }

  validarPassword(): boolean {
    if (RegExp(PASSWORD_REGEX).exec(this.password1)) {
      this.passwordError = '';
      return true;
    } else {
      this.passwordError = PASSWORD_ERROR_MESSAGE;
      return false;
    }
  }

  validarConfirmPassword(): boolean {
    if (this.password1 === this.password2) {
      this.confirmPasswordError = '';
      return true;
    } else {
      this.confirmPasswordError = 'Las contraseñas no coinciden';
      return false;
    }
  }

  togglePasswordVisibility1(): void {
    this.passwordVisible1 = !this.passwordVisible1;
    const passwordInput1 = document.getElementById('password1') as HTMLInputElement;
    passwordInput1.type = this.passwordVisible1 ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void {
    this.passwordVisible2 = !this.passwordVisible2;
    const passwordInput2 = document.getElementById('password2') as HTMLInputElement;
    passwordInput2.type = this.passwordVisible2 ? 'text' : 'password';
  }

  onSubmit(): void {
    if (this.emailInvalid) {
      this.openModal('Correo electrónico invalido');
      return;
    }

    if (!this.validarPassword()) {
      this.openModal('Contraseña inválida');
      return;
    } else if (!this.validarConfirmPassword()) {
      this.openModal('Las contraseñas no coinciden');
      return;
    }

    if (!this.nombre || !this.apellido || !this.apellido2 || !this.email || !this.password1 || !this.password2) {
      this.errorMessage = 'Todos los campos obligatorios deben estar llenos.';
      return;
    }

    let formattedDate = this.fechaAlta ? this.fechaAlta.toString().split('T')[0] : '';
    // Llamada al servicio para registrar el usuario
    this.userService.register(this.email, this.password1, this.password2, this.nombre, this.apellido, this.apellido2)
      .subscribe({
        next: (response) => {
          this.navigateTo('/login');
        },
        error: (error) => {
          console.error('Error al registrar el usuario:', error);
        }
      });
  }

  navigateTo(route: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate([route]);
    }, 1000);
  }

  focusNext(nextFieldIf: string): void {
    const nextElement = document.getElementById(nextFieldIf);
    if (nextElement) {
      nextElement.focus();
    }
  }
  
  openModal(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
