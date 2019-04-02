import { ReactiveFormsModule } from '@angular/forms';
import { LobbyRoutingModule } from './lobby-routing.module';
import { SharedModule } from './../shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateLeagueComponent } from './create-league/create-league.component';
import { JoinContestComponent } from './join-contest/join-contest.component';
import { ContestComponent } from './contest/contest.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    LobbyRoutingModule
  ],
  declarations: [CreateLeagueComponent, JoinContestComponent, ContestComponent]
})
export class LobbyModule { }
