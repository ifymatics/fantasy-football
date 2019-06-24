import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from 'src/app/fanshop/shared/services/category.service';
import { map, catchError } from 'rxjs/Operators';
import { of } from 'rxjs';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
cat
  categories$;
  @Input('category') category;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
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
  }

}
