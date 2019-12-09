import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../user/authguard.service';
import { PredictwinComponent } from './predictwin/predictwin.component';
import { AdminComponent } from './admin/admin.component';
import { CreateGameComponent } from './admin/create-game/create-game.component';
import { ManageGameComponent } from './admin/manage-game/manage-game.component';
import { FreeGameComponent } from './admin/create-game/free/free-game.component';
import { TokenGameComponent } from './admin/create-game/token/token-game.component';
import { ManageTeamFreeComponent } from './admin/manage-game/free/manage-free.component';
import { ManageTokenComponent } from './admin/manage-game/token/manage-token.component';
import { ManageLeaguesComponent } from './admin/manage-leagues/manage-leagues.component';
import { FreeComponent } from './predictwin/free/free.component';
import { TokenComponent } from './predictwin/token/token.component';
import { MypredictionsComponent } from './mypredictions/mypredictions.component';
import { FreePredictionComponent } from './mypredictions/free/free-prediction.component';
import { TokenPredictionComponent } from './mypredictions/token/token-prediction.component';
import { PredictboardComponent } from './predictboard/predictboard.component';


const predictwinRoutes: Routes =
  [
    {
      path: '', canActivate: [AuthGuard], component: PredictwinComponent,
      children: [
        { path: '', redirectTo: 'free', pathMatch: 'full' },
        { path: 'free', component: FreeComponent },
        { path: 'token', component: TokenComponent },

      ]
    },

    { path: 'predictwin-leaderboard', component: PredictboardComponent },
    {
      path: 'my-predictions', canActivate: [AuthGuard], component: MypredictionsComponent,
      children: [
        { path: '', redirectTo: 'free-predictions', pathMatch: 'full' },
        { path: 'free-predictions', component: FreePredictionComponent },
        { path: 'token-predictions', component: TokenPredictionComponent }
      ]
    },

    {
      path: 'admin', canActivate: [AuthGuard], component: AdminComponent, children:
        [
          { path: '', redirectTo: 'create-game', pathMatch: 'full' },
          {
            path: 'create-game', canActivate: [AuthGuard], component: CreateGameComponent, children:
              [
                { path: '', redirectTo: 'free', pathMatch: 'full' },
                { path: 'free', component: FreeGameComponent },
                { path: 'token', component: TokenGameComponent }
              ]
          },
          {
            path: 'manage-game', canActivate: [AuthGuard], component: ManageGameComponent,
            children: [
              { path: '', redirectTo: 'free', pathMatch: 'full' },
              { path: 'free', component: ManageTeamFreeComponent },
              { path: 'token', component: ManageTokenComponent }
            ]
          },

          { path: 'manage-leagues', canActivate: [AuthGuard], component: ManageLeaguesComponent }
        ]
    },

  ];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(predictwinRoutes)
  ]
})
export class PredictwinRoutingModule { }
