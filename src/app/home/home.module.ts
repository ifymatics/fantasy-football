import { SignupComponent } from './../user/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './../user/auth/auth.component';
import { HomeRoutingModule } from './home-routing.module';
import { UserModule } from './../user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared.module';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UserModule,
    // LobbyModule,
    HomeRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HomeRoutingModule

  ],
  declarations: [HomeComponent,
   // JoinContestComponent,
    AuthComponent,
    SignupComponent

  ],
})
export class HomeModule { }
