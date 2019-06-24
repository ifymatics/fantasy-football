import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
// import { AngularFireModule } from 'angularfire';
import { SharedModule } from './../shared.module';
// import { environment } from './../environments/environment';
import { AdminModule } from './admin/admin.module';
import { AdminAuthGuardService } from './admin/services/admin-auth-guard.service';
import { LoginComponent } from './core/components/login/login.component';
import { CoreModule } from './core/core.module';
// import { SharedModule } from './shared/shared.module';
import { ProductsComponent } from './shopping/components/products/products.component';
import { ShoppingModule } from './shopping/shopping.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { FanshopComponent } from './fanshop.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FanSharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    FanshopComponent,
    // ProductsComponent   
  ],
  imports: [
   // BrowserModule,
    SharedModule,
    FanSharedModule,
    AdminModule,  
    ShoppingModule,
    CoreModule,
   AngularFireModule.initializeApp(environment.firebase),
   AngularFirestoreModule,
   AngularFirestoreModule.enablePersistence(),
    RouterModule.forChild([
      { path: '', component:FanshopComponent},
      { path: 'products', component:ProductsComponent},
      { path: 'login', component: LoginComponent },
    ])    
  ]
  /*providers: [
    AdminAuthGuardService,
  ],*/
 
})
export class FanshopModule { }
