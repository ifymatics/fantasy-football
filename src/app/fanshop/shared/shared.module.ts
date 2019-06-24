import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BsNavbarComponent } from '../core/components/bs-navbar/bs-navbar.component';
import { ShoppingModule } from '../shopping/shopping.module';

@NgModule({
  declarations: [  BsNavbarComponent,ProductCardComponent, ProductQuantityComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ProductCardComponent,
    BsNavbarComponent,
    ProductQuantityComponent,
    CommonModule,
    FormsModule,
    // ShoppingModule,
    // CustomFormsModule,
    // DataTableModule,
     AngularFirestoreModule,
    AngularFireAuthModule,
  ],
})
export class FanSharedModule { }
