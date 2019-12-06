import { HowtoearnCoinsComponent } from './howtoearn-coins/howtoearn-coins.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { BuycoinsComponent } from './buycoins/buycoins.component';
import { DepositComponent } from './deposit/deposit.component';
import { HistoryComponent } from './history/history.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MyaccountComponent } from './myaccount.component';
const financeRouting: Routes = [
  { path: '', component: MyaccountComponent, children: [
    {path: '', redirectTo: 'history', pathMatch: 'full'},
    {path: 'history', component: HistoryComponent},
    {path: 'buy-coins', component: BuycoinsComponent},
    {path: 'deposit', component:  DepositComponent},
    {path: 'withdraw', component: WithdrawComponent},
    {path: 'how-to-earn-coins', component: HowtoearnCoinsComponent},
  ]
}
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(financeRouting),
  ],
  exports: [RouterModule],
})
export class FinanceRoutingModule { }
