import { MomentModule } from 'ngx-moment';
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
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { CategoryService } from './fanshop/shared/services/category.service';
import { ProductService } from './fanshop/shared/services/product.service';
import { ShoppingCartService } from './fanshop/shared/services/shopping-cart.service';
import { OrderService } from './fanshop/shared/services/order.service';
import { UserService } from './fanshop/shared/services/user.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UserModule } from './user/user.module';


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
     /* for firebase */
     // AngularFireModule.initializeApp(environment.firebase),
    
     AngularFireModule.initializeApp(environment.firebase),
     AngularFireAuthModule,
     AngularFirestoreModule,
     AngularFireStorageModule,

    AngularFirestoreModule.enablePersistence(),
     /*end of for firebase */
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
  providers: [AngularFirestore,{provide:AngularFirestoreDocument}],
  bootstrap: [AppComponent]
})
export class AppModule { }
