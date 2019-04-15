import { EditProfileComponent } from './edit-profile/edit-profile.component';
// import { EditComponent } from './profile/edit/edit.component';
import { ProfileComponent } from './profile/profile.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const userRoutes: Routes = [
   {path: 'profile', component: ProfileComponent},
   {path: 'profile/edit', component: EditProfileComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes)
  ],
  declarations: []
})
export class UserRoutingModule { }
