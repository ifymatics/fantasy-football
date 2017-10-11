import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const leaderboardRoute: Routes = [
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(leaderboardRoute)
  ],
  exports: [RouterModule]
})
export class LeaderboardRoutingModule { }
