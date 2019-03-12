import { ProfileComponent } from './profile/profile.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const userRoutes: Routes = [
  // {path: '', component: ProfileComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes)
  ],
  declarations: []
})
export class UserRoutingModule { }
