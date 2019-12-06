import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FanSharedModule } from '../shared/shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

/*@NgModule({
  declarations: [AdminOrdersComponent, AdminProductsComponent, AdminFormComponent],
  imports: [
    CommonModule
  ]
})*/
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FanSharedModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    RouterModule.forChild([
      { 
        path: 'admin/products/new', 
        component: ProductFormComponent, 
       // canActivate: [AuthGuard, AdminAuthGuard] 
      },
      { 
        path: 'admin/products/:id', 
        component: ProductFormComponent, 
       // canActivate: [AuthGuard, AdminAuthGuard] 
      },
      { 
        path: 'admin/products', 
        component: AdminProductsComponent, 
       // canActivate: [AuthGuard, AdminAuthGuard] 
      },
      { 
        path: 'admin/orders', 
        component: AdminOrdersComponent, 
        // canActivate: [AuthGuard, AdminAuthGuard] 
      }
    ])            
  ],
  declarations: [
    ProductFormComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
  ]
})
export class AdminModule { }
