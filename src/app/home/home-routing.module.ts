import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NewHomeComponent } from './new-home/new-home.component';
import { PredictwinHomeComponent } from '../predictwin-home/predictwin-home.component';

const homeRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: NewHomeComponent },
  { path: 'predictwin-home', component: PredictwinHomeComponent }
  // {path: 'lobby', component: HeaderComponent},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
