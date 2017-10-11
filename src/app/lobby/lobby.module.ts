import { SharedModule } from './../shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateLeagueComponent } from './create-league/create-league.component';
import { JoinContestComponent } from './join-contest/join-contest.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [CreateLeagueComponent, JoinContestComponent]
})
export class LobbyModule { }
