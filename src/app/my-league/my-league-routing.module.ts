import { ContestViewComponent } from './contest-view/contest-view.component';
import { AuthGuard } from './../user/authguard.service';
import { DefaultComponent } from './default/default.component';
import { CompletedComponent } from './completed/completed.component';
import { LiveComponent } from './live/live.component';
import { LeaguesComponent } from './leagues/leagues.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingComponent } from './upcoming/upcoming.component';
const myLeagueRoutes: Routes = [
  {path: '', canActivate: [AuthGuard], component: LeaguesComponent, children: [
    {path: '', redirectTo: 'live', pathMatch: 'full'},
    {path: 'live', canActivate: [AuthGuard], component: LiveComponent},
    {path: 'upcoming',  canActivate: [AuthGuard], component: UpcomingComponent},
    {path: 'completed', canActivate: [AuthGuard], component: CompletedComponent}
  ]
},
{path: 'contest-info/:lineup_master_id/:contest_id/:collection_master_id', canActivate: [AuthGuard], component: ContestViewComponent}


  // {path: '',  component: ContestComponent},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myLeagueRoutes)
  ],
  declarations: []
})
export class MyLeagueRoutingModule { }
