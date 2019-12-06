import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/fanshop/shared/services/category.service';
import { ProductService } from 'src/app/fanshop/shared/services/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/fanshop/shared/models/product';
import { map } from 'rxjs/Operators';
import { UtilityService } from 'src/app/utility.service';
class Categories {
  id: string;
  name: string;
}
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  // @ViewChild('files') files:File;
  public imagePath;
  imgURL: any;
  public message: string;
  categories$;
  check;
  product: Product;
  id = null;
  productForm;
  categories = [];
  fileToUpload: File = null;
  session;
  userId;
  adminIds = ['1', '2', '3', '4', '5005', '6', '28'];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private utils: UtilityService
  ) {

  }
  ngOnInit() {
    // console.log('xiggiiii')
    const user = this.utils.getLocalStorage('user');
    this.session = user.data.session_key;
    this.userId = user.data.user_profile.user_id;
    if (!this.adminIds.includes(this.userId)) { this.router.navigate(['/home']); }
    this.productForm = new FormGroup({
      'title': new FormControl(/*this.product.title*/null, [Validators.required]),
      'price': new FormControl(null, Validators.required),
      'qty': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required),
      'imageUrl': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      // 'rememberMe': new FormControl(null)
    });
    this.categoryService.getAll()
    /*.snapshotChanges().pipe( 
       map(changes => changes.map(c=> ({id: c.payload.doc.id, name: c.payload.doc.get('name')}))
        // this.categories.push({id: cate.payload.doc.id, name: cate.payload.doc.get('name')});
         )
    )*/.subscribe(
      categories => {
        console.log(categories);
        this.categories = categories;
      }
    );
    this.categories$ = this.categoryService.getAll();
    // console.log(this.categories);

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.get(this.id).subscribe(p => {
        this.product = p;
        this.productForm.get('title').setValue(this.product.title);
        this.productForm.get('price').setValue(this.product.price);
        this.productForm.get('qty').setValue(this.product.qty);
        this.productForm.get('category').setValue(this.product.category);
        this.productForm.get('imageUrl').setValue(this.product.imageUrl);
        this.productForm.get('description').setValue(this.product.description);
      });

    }
  }

  save(product?) {
    // console.log(this.productForm);
    // console.log(this.categories$);
    if (this.id) {
      this.productService.update(this.id, this.productForm.value);
    } else { this.productService.create(this.productForm.value); }
    this.router.navigate(['/fanshop/admin/products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.id);
    this.router.navigate(['fanshop/admin/products']);
  }
  handleFileInput(files: FileList) {

    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload.name);
  }

  preview(files: FileList) {
    // console.log(files);
    if (files.length === 0) { return; }

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

}
