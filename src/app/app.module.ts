import { MomentModule } from 'ngx-moment';
import { InitsDirective } from './inits.directive';
import { HomeComponent } from './home/home/home.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './home/header/header.component';
import { LeagueModule } from './league/league.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgxWebstorageModule } from 'ngx-webstorage';


@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    MDBBootstrapModule.forRoot(),
    HomeModule,
    // UserModule,
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    })
   // LeagueModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
