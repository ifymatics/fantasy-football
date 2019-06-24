import { AppComponent } from './app.component';
import { AuthGuard } from './user/authguard.service';

import { NgModule } from '@angular/core';
import { RouterModule , Routes,  PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';



const fantRoutes: Routes = [
 {path: '',   loadChildren: './home/home.module#HomeModule' },
 {path: ':id/league', canActivateChild: [AuthGuard], loadChildren: './league/league.module#LeagueModule'},
 {path: ':id/:league_id/lobby', canActivateChild: [AuthGuard], loadChildren: './lobby/lobby.module#LobbyModule'},
 {path: ':id/:league_id/my-league', canActivateChild: [AuthGuard], loadChildren: './my-league/my-league.module#MyLeagueModule'},
 {path: ':sports_id/lineup/:league_id/:contest_id',  canActivateChild: [AuthGuard], loadChildren: './lineup/lineup.module#LineupModule'},
 {path: ':sports_id/leaderboard',  canActivateChild: [AuthGuard], loadChildren: './leaderboard/leaderboard.module#LeaderboardModule'},
  {path: ':id/user', canActivateChild: [AuthGuard], loadChildren: './user/user.module#UserModule'},
  {path: ':id/finance', canActivateChild: [AuthGuard], loadChildren: './finance/finance.module#FinanceModule'},
  {path: ':id/chat', canActivateChild: [AuthGuard], loadChildren: './chat/chat.module#ChatModule'},
   {path: 'fanshop', canActivateChild: [AuthGuard], loadChildren: './fanshop/fanshop.module#FanshopModule'},

   // {path: '', redirectTo: '/', pathMatch: 'full'},
];
@NgModule({
  imports: [
    CommonModule,
  RouterModule.forRoot(fantRoutes , /* { enableTracing: true }*/
    {useHash: true, preloadingStrategy: PreloadAllModules} )
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
