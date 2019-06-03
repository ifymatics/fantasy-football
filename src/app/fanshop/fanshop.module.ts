import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FanshopComponent } from './fanshop/fanshop.component';
import { AdminProductsComponent } from './admin/controllers/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/controllers/admin-orders/admin-orders.component';
import { ProductFormComponent } from './admin/controllers/product-form/product-form.component';

@NgModule({
  declarations: [FanshopComponent, AdminProductsComponent, AdminOrdersComponent, ProductFormComponent],
  imports: [
    CommonModule
  ]
})
export class FanshopModule { }
