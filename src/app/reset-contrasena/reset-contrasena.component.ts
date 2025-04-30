import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/users.service';



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
  if (!this.newPassword || !this.confirmPassword) {
    this.error = 'Debes completar ambos campos de contraseña.';
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
      alert(this.mensaje); // O usar un modal / snackbar si prefieres
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.error = err?.error || 'Error al restablecer la contraseña.';
    }
  });
}

}