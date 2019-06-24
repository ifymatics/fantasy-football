import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from 'src/app/fanshop/shared/models/shopping-cart';
import { Observable } from 'rxjs';
import { ShoppingCartService } from 'src/app/fanshop/shared/services/shopping-cart.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  cart$: Observable<ShoppingCart>;
  
  constructor(private shoppingCartService: ShoppingCartService) {}
  
  async ngOnInit() { 
    this.cart$ = await this.shoppingCartService.getCart();
  }
}
