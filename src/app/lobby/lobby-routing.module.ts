import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 const lobbyRoutes: Routes = [
 ];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(lobbyRoutes)
  ],
  exports: [ RouterModule]
})
export class LobbyRoutingModule { }
