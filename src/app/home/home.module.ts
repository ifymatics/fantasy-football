import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './../user/auth/auth.component';
import { NewlobbyComponent } from './../lobby/newlobby/newlobby.component';
import { HomeRoutingModule } from './home-routing.module';
import { JoinContestComponent } from './../shared/join-contest/join-contest.component';
import { LobbyModule } from './../lobby/lobby.module';
import { UserModule } from './../user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared.module';


@NgModule({
  imports: [
    CommonModule,
    UserModule,
    LobbyModule,
    HomeRoutingModule,
    HomeRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

  ],
  declarations: [HomeComponent,
    JoinContestComponent,
    AuthComponent
  ],
})
export class HomeModule { }
