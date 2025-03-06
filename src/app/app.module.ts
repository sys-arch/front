import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CircuitComponent } from './circuit/circuit.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';



const routes: Routes = [ 
  {path: 'login', component: LoginComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    CircuitComponent
    LoginComponent,
    HeaderComponent,
    FooterComponent,

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
