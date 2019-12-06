import { SharedModule } from './../shared.module';
import { LineupRoutingModule } from './lineup-routing.module';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LineupComponent } from './lineup/lineup.component';
import { HomeModule } from '../home/home.module';
import { KeyValuePipe } from './key-value.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { InitsDirective } from '../inits.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LineupRoutingModule,
   // InitsDirective,
    //  ReactiveFormsModule,
   // HomeModule
   SharedModule
  ],
  exports: [InitsDirective],
  declarations: [LineupComponent, KeyValuePipe, InitsDirective]
})
export class LineupModule { }
