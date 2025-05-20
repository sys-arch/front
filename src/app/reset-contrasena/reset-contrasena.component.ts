import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/users.service';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_ç<>])[A-Za-z\d@$!%*?&#+\-_ç<>]{8,}$/;
const PASSWORD_ERROR_MESSAGE =
  'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.';


@Component({
  selector: 'app-reset-contrasena',
  standalone: false,
  templateUrl: './reset-contrasena.component.html',
  styleUrl: './reset-contrasena.component.css'
})


export class ResetContrasenaComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  mensaje: string = '';
  error: string = '';
  isValidToken: boolean = false;
  passwordVisible1: boolean = false;
  passwordVisible2: boolean = false;
  passwordError: string = '';
  confirmPasswordError: string = '';

  

  togglePasswordVisibility1(): void {
    this.passwordVisible1 = !this.passwordVisible1;
    const passwordInput = document.getElementById('password1') as HTMLInputElement;
    passwordInput.type = this.passwordVisible1 ? 'text' : 'password';
  }

  togglePasswordVisibility2(): void {
    this.passwordVisible2 = !this.passwordVisible2;
    const passwordInput = document.getElementById('password2') as HTMLInputElement;
    passwordInput.type = this.passwordVisible2 ? 'text' : 'password';
  }
  validarPassword(): boolean {
    if (RegExp(PASSWORD_REGEX).exec(this.newPassword)) {
      this.passwordError = '';
      return true;
    } else {
      this.passwordError = PASSWORD_ERROR_MESSAGE;
      return false;
    }
  }

  validarConfirmPassword(): boolean {
    if (this.newPassword === this.confirmPassword) {
      this.confirmPasswordError = '';
      return true;
    } else {
      this.confirmPasswordError = 'Las contraseñas no coinciden';
      return false;
    }
  }


  // Ir a otra ruta
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.userService.validateResetToken(this.token).subscribe({
          next: () => {
            this.isValidToken = true;
          },
          error: () => {
            this.isValidToken = false;
          }
        });
      } else {
        this.isValidToken = false;
      }
    });
  }
  

  onSubmit(): void {
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.error = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Debes completar ambos campos de contraseña.';
      return;
    }

    if (!this.validarPassword()) {
      return;
    }

    if (!this.validarConfirmPassword()) {
      return;
    }

    this.userService.resetPassword({
      token: this.token,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    })
    .subscribe({
      next: () => {
        this.mensaje = '¡Contraseña restablecida con éxito!';
        alert(this.mensaje);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err?.error || 'Error al restablecer la contraseña.';
      }
    });
  }


}