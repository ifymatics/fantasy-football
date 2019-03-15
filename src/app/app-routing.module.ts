import { AppComponent } from './app.component';
import { AuthGuard } from './user/authguard.service';
import { JoinContestComponent } from './shared/join-contest/join-contest.component';
import { NewlobbyComponent } from './lobby/newlobby/newlobby.component';

import { NgModule } from '@angular/core';
import { RouterModule , Routes,  PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home/home.component';


const fantRoutes: Routes = [
  {path: '',   loadChildren: './home/home.module#HomeModule' },
 //  {path: '',  component: AppComponent,  pathMatch: 'full'},
 {path: ':id/league', canActivateChild: [AuthGuard], loadChildren: './league/league.module#LeagueModule'},
 {path: 'profile', loadChildren: './user/user.module#UserModule'},
 {path: ':id/:league_id/lobby', canActivateChild: [AuthGuard], loadChildren: './lobby/lobby.module#LobbyModule'},
 {path: ':id/:league_id/my-league', canActivateChild: [AuthGuard], loadChildren: './my-league/my-league.module#MyLeagueModule'},
 {path: ':sports_id/lineup/:league_id/:contest_id',  canActivateChild: [AuthGuard], loadChildren: './lineup/lineup.module#LineupModule'},

  // {path: '', redirectTo: '/', pathMatch: 'full'},

   // {path: '',  component: AppComponent,  pathMatch: 'full'}
];
@NgModule({
  imports: [
    CommonModule,
  RouterModule.forRoot(fantRoutes , /* { enableTracing: true }*/
    /*{useHash: true}*/ /*{preloadingStrategy: PreloadAllModules} */)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
