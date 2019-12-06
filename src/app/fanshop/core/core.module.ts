import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HomeRoutingModule } from 'src/app/home/home-routing.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ HomeComponent, LoginComponent],
  imports: [
    CommonModule,
    RouterModule
    
  ],
  exports: [
    
  ]
})
export class CoreModule { }
