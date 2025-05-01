import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircuitComponent } from './circuit/circuit.component';
import { ContrasenaOlvidadaComponent } from './contrasena-olvidada/contrasena-olvidada.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetContrasenaComponent } from './reset-contrasena/reset-contrasena.component';
import { HeaderComponent } from './shared/header/header.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Define la ruta
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Opcional: redirige la raíz a login
  { path: 'header', component: HeaderComponent }, // Define la ruta
  { path: 'circuit', component: CircuitComponent }, // Define la ruta
  { path: 'reset-contrasena', component: ResetContrasenaComponent }, // Define la ruta
  { path: 'contrasena-olvidada', component: ContrasenaOlvidadaComponent }, // Define la ruta
  { path: 'register', component: RegisterComponent}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
