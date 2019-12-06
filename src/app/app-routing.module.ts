import { AppComponent } from './app.component';
import { AuthGuard } from './user/authguard.service';

import { NgModule } from '@angular/core';
import { RouterModule , Routes,  PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';



const fantRoutes: Routes = [
 {path: '',   loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
 {path: ':id/league', canActivateChild: [AuthGuard], loadChildren: () => import('./league/league.module').then(m => m.LeagueModule)},
 {path: ':id/:league_id/lobby', canActivateChild: [AuthGuard], loadChildren: () => import('./lobby/lobby.module').then(m => m.LobbyModule)},
 {path: ':id/:league_id/my-league', canActivateChild: [AuthGuard], loadChildren: () => import('./my-league/my-league.module').then(m => m.MyLeagueModule)},
 {path: ':sports_id/lineup/:league_id/:contest_id',  canActivateChild: [AuthGuard], loadChildren: () => import('./lineup/lineup.module').then(m => m.LineupModule)},
 {path: ':sports_id/leaderboard',  canActivateChild: [AuthGuard], loadChildren: () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardModule)},
  {path: ':id/user', canActivateChild: [AuthGuard], loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  {path: ':id/finance', canActivateChild: [AuthGuard], loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule)},
  {path: ':id/chat', canActivateChild: [AuthGuard], loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)},
   {path: 'fanshop', canActivateChild: [AuthGuard], loadChildren: () => import('./fanshop/fanshop.module').then(m => m.FanshopModule)},
   {path: 'predict-win', canActivateChild: [AuthGuard], loadChildren: () => import('./predictwin/predictwin.module').then(m => m.PredictwinModule)},

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
