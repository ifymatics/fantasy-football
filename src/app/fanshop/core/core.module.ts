import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [BsNavbarComponent, HomeComponent],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
