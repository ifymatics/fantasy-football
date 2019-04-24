import { UtilityService } from './../../utility.service';
import { AuthloginService } from './../../user/authlogin.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-buycoins',
  templateUrl: './buycoins.component.html',
  styleUrls: ['./buycoins.component.scss']
})
export class BuycoinsComponent implements OnInit {
  depositAmountArr = [50, 100, 250, 500];
  coins;
  isLoading = false;
  session;
  buycoinForm;
  addFundAmount;
  currentUser;
  coin_real_money = 0;
   coin_value     = 0;
   params = { amount: '', subscription: ''};
   posting = true;
  constructor(private service: AuthloginService, private utilityservice: UtilityService) { }

  ngOnInit() {
    const user          =     this.utilityservice.getLocalStorage('user');
    this.currentUser    =     user.data.user_profile;
    this.session = user.data.session_key;
    const amount = this.params.amount;
   this.coins = (amount) ? parseFloat(amount) : this.depositAmountArr[0];
   this.addFundAmount = (amount) ? parseFloat(amount) : this.depositAmountArr[0];
   this.buycoinForm = new FormGroup({
    'coins': new FormControl(this.addFundAmount, Validators.required)
  });

   this.getCoinValue();
  }
  getCoinValue() {
    this.service.api('fantasy/point_system/get_point_value', {}, 'post', this.session)
    .subscribe((response) => {
       if (response.response_code === 200) {
           response = response.data;
          this.coin_real_money = parseFloat(response.real_money);
          this.coin_value     = parseFloat(response.coin_value);
       }
   }, (error) => {
       this.posting = false;
      // console.log(error);
   });
}
buyCoins() {
  this.buycoinForm.get('coins').setValue(this.addFundAmount);
  // this.isLoading = true;
  this.posting = false;
  console.log(this.buycoinForm.value);
  console.log(this.addFundAmount);
     const reqData = this.buycoinForm.value; // {coins: this.coins};
     this.service.api('user/finance/buy_coins', reqData, 'POST', this.session)
     .subscribe((response) => {
         if (response.response_code === 200) {
           this.isLoading = false;
          this.posting = false;
             this.coins = this.addFundAmount;
           //  console.log(response);
             // getTransactionAmount();
             alert('success!');
             // emitAlert.on(response.message, 'success');
         }
         this.posting = false;
     }, (error) => {
         this.isLoading = false;
         this.posting = false;
         // emitAlert.on(UtilityService.getErrorMessage(error), 'danger');
     });

}

}
