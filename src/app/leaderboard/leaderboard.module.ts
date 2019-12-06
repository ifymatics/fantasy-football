import { SharedModule } from './../shared.module';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateComponent } from './private/private.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SingleLeaderboardComponent } from './leaderboard/single-leaderboard/single-leaderboard.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LeaderboardRoutingModule,
  ],
  declarations: [PrivateComponent, LeaderboardComponent, SingleLeaderboardComponent]
})
export class LeaderboardModule { }
