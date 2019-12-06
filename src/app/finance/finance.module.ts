import { SharedModule } from './../shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FinanceRoutingModule } from './finance-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepositComponent } from './deposit/deposit.component';
import { BuycoinsComponent } from './buycoins/buycoins.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { HistoryComponent } from './history/history.component';
import { HowtoearnCoinsComponent } from './howtoearn-coins/howtoearn-coins.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { MyaccountComponent } from './myaccount.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  imports: [
    CommonModule,
    FinanceRoutingModule,
    MDBBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
   SharedModule
  ],
  declarations: [DepositComponent, BuycoinsComponent,
     SubscribeComponent, HistoryComponent, HowtoearnCoinsComponent, WithdrawComponent, MyaccountComponent]
})
export class FinanceModule { }
