import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BsNavbarComponent } from '../core/components/bs-navbar/bs-navbar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RatingComponent } from './components/rating.component';
import { MyDirectiveDirective } from './my-directive.directive';
import { SharedModule } from 'src/app/shared.module';
import { ModalAlertComponent } from '../modal-alert/modal-alert.component';
// import { ModalAlertComponent } from 'src/app/modal-alert/modal-alert.component';


@NgModule({
  declarations: [  BsNavbarComponent,
    ProductCardComponent,
     ProductQuantityComponent,
      RatingComponent, MyDirectiveDirective,
      ModalAlertComponent

    ],
  imports: [
    CommonModule,
    MDBBootstrapModule,
  ],
  exports: [
    ProductCardComponent,
    BsNavbarComponent,
    ProductQuantityComponent,
    ModalAlertComponent,
    CommonModule,
    FormsModule,
    MDBBootstrapModule,
     // SharedModule,
    // ShoppingModule,
    // CustomFormsModule,
    // DataTableModule,
     AngularFirestoreModule,
    AngularFireAuthModule,
  ],
})
export class FanSharedModule { }
