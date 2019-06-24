import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/fanshop/shared/models/product';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/fanshop/shared/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {

  products: Product[];
  filteredProducts:Product[];
  subscription: Subscription;
  // tableResource: DataTableResource<Product>;
  items: Product[] = [];
  itemCount: number; 

  constructor(private productService: ProductService) { 
    this.subscription = this.productService.getAll()
      .subscribe(products => {
        this.products = products;
        // this.initializeTable(products);
      });
  }

  // private initializeTable(products: Product[]) {
  //    this.tableResource = new DataTableResource(products);
  //   this.tableResource.query({ offset: 0 })
  //     .then(items => this.items = items);
  //   this.tableResource.count()
  //     .then(count => this.itemCount = count);
  // }

  // reloadItems(params) {
  //   if (!this.tableResource) return;

  //   this.tableResource.query(params)
  //     .then(items => this.items = items);    
  //  }

  filter(query: string) { 
    // console.log(query);
    this.filteredProducts = (query) ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;

   // this.initializeTable(filteredProducts);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

}
