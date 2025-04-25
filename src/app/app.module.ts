import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CircuitComponent } from './circuit/circuit.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { PaymentsComponent } from './payments/payments.component';
import { MyCircuitsComponent } from './mis-circuitos/mis-circuitos.component';



const routes: Routes = [ 
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
  
];
@NgModule({
  declarations: [
    AppComponent,
    CircuitComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    PaymentsComponent,
    MyCircuitsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
