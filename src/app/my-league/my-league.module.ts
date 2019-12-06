import { KeyValuePipe } from './../lineup/key-value.pipe';
import { MomentModule } from 'ngx-moment';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../shared.module';
import { MyLeagueRoutingModule } from './my-league-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaguesComponent } from './leagues/leagues.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { LiveComponent } from './live/live.component';
import { CompletedComponent } from './completed/completed.component';
import { DefaultComponent } from './default/default.component';
import { ContestViewComponent } from './contest-view/contest-view.component';

@NgModule({
  imports: [
    CommonModule,
    MyLeagueRoutingModule,
    SharedModule,
    FormsModule,
    MomentModule
  ],
  declarations: [LeaguesComponent, UpcomingComponent, LiveComponent, CompletedComponent,
     DefaultComponent, ContestViewComponent]
})
export class MyLeagueModule { }
