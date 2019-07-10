import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from 'src/app/fanshop/shared/services/category.service';
import { map, catchError } from 'rxjs/Operators';
import { of } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  mobile = false;
  open = false;
 cat;
  categories$;
  @Input('category') category;

  constructor(private categoryService: CategoryService, private d_svice: DeviceDetectorService) {
  }

  ngOnInit() {
    this.device();
    this.categories$ = this.categoryService.getAll();
   this.categoryService.getAll()
   /*.pipe(
    map(changes => changes.map(c=> ({id: c.payload.doc.id, name: c.payload.doc.get('name')}))
     // this.categories.push({id: cate.payload.doc.id, name: cate.payload.doc.get('name')});
      )
  // // )*/.subscribe(
    categories =>{
      console.log(categories);
      this.cat = categories;
    }
  );
  // console.log(this.mobile);
  }
  onToggle() {
    console.log('hello');
    this.open = !this.open;
    // this.d_svice.isMobile();
  }
  device() {

    if (this.d_svice.isMobile()) {
     // console.log(this.d_svice.isMobile());
      this.mobile = true;
    } else if (this.d_svice.isDesktop) {
      this.mobile = false;
      // return this.d_svice.isDesktop();
    }
    return this.d_svice.isTablet();
  }

}
