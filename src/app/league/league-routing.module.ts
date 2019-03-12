
import { LeagueComponent } from './league/league.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
const leagueRoutes: Routes = [
  {path: '', component: LeagueComponent },

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(leagueRoutes)
  ],
  exports: [RouterModule]
})
export class LeagueRoutingModule { }
