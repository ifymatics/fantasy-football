import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BsNavbarComponent } from '../core/components/bs-navbar/bs-navbar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [  BsNavbarComponent,ProductCardComponent, ProductQuantityComponent],
  imports: [
    CommonModule,
    MDBBootstrapModule,
  ],
  exports: [
    ProductCardComponent,
    BsNavbarComponent,
    ProductQuantityComponent,
    CommonModule,
    FormsModule,
    MDBBootstrapModule,
    // ShoppingModule,
    // CustomFormsModule,
    // DataTableModule,
     AngularFirestoreModule,
    AngularFireAuthModule,
  ],
})
export class FanSharedModule { }
