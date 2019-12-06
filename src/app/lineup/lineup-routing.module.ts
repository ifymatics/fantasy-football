import { ContestResolver } from '../lobby/join-contest/contest-resolver.service';
import { Routes, RouterModule } from '@angular/router';
import { LineupComponent } from './lineup/lineup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
const lineupRoutes: Routes = [
  {path: '',  component: LineupComponent,  resolve: {contest: ContestResolver } }];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(lineupRoutes)
  ],
  exports: [RouterModule]
})
export class LineupRoutingModule { }
