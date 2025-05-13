import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // importa el guard
import { CircuitComponent } from './circuit/circuit.component';
import { ContrasenaOlvidadaComponent } from './contrasena-olvidada/contrasena-olvidada.component';
import { LoginComponent } from './login/login.component';
import { MyCircuitsComponent } from './mis-circuitos/mis-circuitos.component';
import { PaymentsComponent } from './payments/payments.component';
import { RegisterComponent } from './register/register.component';
import { ResetContrasenaComponent } from './reset-contrasena/reset-contrasena.component';
import { HeaderComponent } from './shared/header/header.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Define la ruta
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Opcional: redirige la raíz a login
  { path: 'header', component: HeaderComponent }, // Define la ruta
  { path: 'circuit', component: CircuitComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent},
  { path: 'reset-contrasena', component: ResetContrasenaComponent }, // Define la ruta
  { path: 'contrasena-olvidada', component: ContrasenaOlvidadaComponent }, // Define la ruta
  { path: 'mis-circuitos', component: MyCircuitsComponent, canActivate: [AuthGuard] },
  { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard]}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
