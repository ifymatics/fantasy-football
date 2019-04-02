import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const leaderboardRoute: Routes = [
  {path: '', component: LeaderboardComponent },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(leaderboardRoute)
  ],
  exports: [RouterModule]
})
export class LeaderboardRoutingModule { }
