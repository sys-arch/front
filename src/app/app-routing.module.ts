import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircuitComponent } from './circuit/circuit.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/header/header.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Define la ruta
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Opcional: redirige la raíz a login
  { path: 'header', component: HeaderComponent }, // Define la ruta
  { path: 'circuit', component: CircuitComponent }, // Define la ruta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
