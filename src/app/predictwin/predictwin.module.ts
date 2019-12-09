import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictwinComponent } from './predictwin/predictwin.component';
import { AdminComponent } from './admin/admin.component';
import { FreeComponent } from './predictwin/free/free.component';
import { TokenComponent } from './predictwin/token/token.component';
import { PredictwinRoutingModule } from './predictwin-routing.module';
import { AdminModule } from '../fanshop/admin/admin.module';
import { SharedModule } from './../shared.module';
import { CreateGameComponent } from './admin/create-game/create-game.component';
import { ManageGameComponent } from './admin/manage-game/manage-game.component';
import { RouterModule } from '@angular/router';
import { ManageTokenComponent } from './admin/manage-game/token/manage-token.component';
import { ManageTeamFreeComponent } from './admin/manage-game/free/manage-free.component';
import { ManageLeaguesComponent } from './admin/manage-leagues/manage-leagues.component';
import { TokenGameComponent } from './admin/create-game/token/token-game.component';
import { FreeGameComponent } from './admin/create-game/free/free-game.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PredictwinService } from './predictwin.service';
import { MypredictionsComponent } from './mypredictions/mypredictions.component';
import { FreePredictionComponent } from './mypredictions/free/free-prediction.component';
import { TokenPredictionComponent } from './mypredictions/token/token-prediction.component';
import { PredictboardComponent } from './predictboard/predictboard.component';


// import { PredictwinRoutingModule } from './predictwin-routing.module';

@NgModule({
  declarations: [
    ManageTokenComponent,
    FreeComponent,
    TokenComponent,
    TokenGameComponent,
    FreeGameComponent,
    PredictwinComponent,
    AdminComponent,
    ManageGameComponent,
    CreateGameComponent,
    ManageTeamFreeComponent,
    ManageLeaguesComponent,
    MypredictionsComponent,
    FreePredictionComponent,
    TokenPredictionComponent,
    PredictboardComponent,


  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PredictwinRoutingModule,
    SharedModule,

    // AdminModule
  ],
  // providers: [PredictwinService]
})
export class PredictwinModule { }
