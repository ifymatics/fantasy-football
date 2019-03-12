import { ContestResolver } from './join-contest/contest-resolver.service';
import { resolve } from 'q';
import { AuthGuard } from './../user/authguard.service';
import { JoinContestComponent } from './join-contest/join-contest.component';
import { ContestComponent } from './contest/contest.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 const lobbyRoutes: Routes = [
   {path: '', /* canActivate: [AuthGuard]*/ component: JoinContestComponent},
   // {path: '',  component: ContestComponent},
 ];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(lobbyRoutes)
  ],
  exports: [ RouterModule]
})
export class LobbyRoutingModule { }
