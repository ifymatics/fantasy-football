import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';

const homeRoutes: Routes = [
  {path: '', component: HomeComponent},
  // {path: 'lobby', component: HeaderComponent},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
  ],
  exports: [ RouterModule]
})
export class HomeRoutingModule { }
