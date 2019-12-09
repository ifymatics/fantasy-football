import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared.module';
import { PredictwithscoreRoutingModule } from './predictwithscore-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PredictwithscoreadminComponent } from './predictwithscoreadmin/predictwithscoreadmin.component';
import { FreeScoreComponent } from './free-score/free-score.component';
import { TokenScoreComponent } from './token-score/token-score.component';
import { PredictwithscoreComponent } from './predictwithscore.component';



@NgModule({
  declarations: [
    PredictwithscoreComponent,
    PredictwithscoreadminComponent,
    FreeScoreComponent,
    TokenScoreComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PredictwithscoreRoutingModule,
    SharedModule,
  ]
})
export class PredictwithscoreModule { }
