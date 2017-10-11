import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepositComponent } from './deposit/deposit.component';
import { BuycoinsComponent } from './buycoins/buycoins.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { HistoryComponent } from './history/history.component';
import { HowtoearnCoinsComponent } from './howtoearn-coins/howtoearn-coins.component';
import { WithdrawComponent } from './withdraw/withdraw.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DepositComponent, BuycoinsComponent, SubscribeComponent, HistoryComponent, HowtoearnCoinsComponent, WithdrawComponent]
})
export class FinanceModule { }
