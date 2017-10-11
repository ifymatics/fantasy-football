import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateComponent } from './private/private.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@NgModule({
  imports: [
    CommonModule,
    LeaderboardRoutingModule
  ],
  declarations: [PrivateComponent, LeaderboardComponent]
})
export class LeaderboardModule { }
