import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../user/authguard.service';
import { PredictwithscoreComponent } from './predictwithscore.component';
import { FreeScoreComponent } from './free-score/free-score.component';
import { TokenScoreComponent } from './token-score/token-score.component';

const predictwithscoreRouting: Routes = [
  {
    path: '', canActivate: [AuthGuard], component: PredictwithscoreComponent,
    children: [
      { path: '', redirectTo: 'free-score', pathMatch: 'full' },
      { path: 'free-score', component: FreeScoreComponent },
      { path: 'token-score', component: TokenScoreComponent },

    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(predictwithscoreRouting)
  ]
})
export class PredictwithscoreRoutingModule { }
