import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/fanshop/shared/services/category.service';
import { ProductService } from 'src/app/fanshop/shared/services/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/fanshop/shared/models/product';
import { map } from 'rxjs/Operators';
class Categories {
  id:string;
  name: string;
}
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  categories$;
  check;
  product: Product; 
  id = null;
  productForm;
  categories=[];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private categoryService: CategoryService, 
    private productService: ProductService) {
    
  }
  ngOnInit() {
    this.productForm = new FormGroup({
      'title': new FormControl(/*this.product.title*/null, [Validators.required]),
      'price': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required),
      'imageUrl':  new FormControl(null, Validators.required),
      // 'rememberMe': new FormControl(null)
    });
   this.categoryService.getAll()
    /*.snapshotChanges().pipe( 
       map(changes => changes.map(c=> ({id: c.payload.doc.id, name: c.payload.doc.get('name')}))
        // this.categories.push({id: cate.payload.doc.id, name: cate.payload.doc.get('name')});
         )
    )*/.subscribe(
       categories =>{
         console.log(categories);
         this.categories = categories;
       }
     );
      this.categories$ = this.categoryService.getAll();
     console.log(this.categories);

    this.id = this.route.snapshot.paramMap.get('id');
     if (this.id) {
       this.productService.get(this.id).subscribe(p => {this.product = p ;
        this.productForm.get('title').setValue(this.product.title);
        this.productForm.get('price').setValue(this.product.price);
        this.productForm.get('category').setValue(this.product.category);
        this.productForm.get('imageUrl').setValue(this.product.imageUrl);
      });
     
      }
  }

  save(product?) {
    console.log(this.productForm);
    // console.log(this.categories$);
    if (this.id) {
      this.productService.update(this.id, this.productForm.value);
    } else {this.productService.create(this.productForm.value);}
    this.router.navigate(['/fanshop/admin/products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    this.productService.delete(this.id);
    this.router.navigate(['fanshop/admin/products']);
  }

}
