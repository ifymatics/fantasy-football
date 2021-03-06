import { SharedModule } from './../shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LeagueRoutingModule } from './league-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueComponent } from './league/league.component';

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModule,
    SharedModule,
    LeagueRoutingModule,
  ],
  declarations:
   [
     LeagueComponent,

    ]
})
export class LeagueModule { }
