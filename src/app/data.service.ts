import { UtilityService } from './utility.service';
import { AuthloginService } from './user/authlogin.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
  })
export class DataService {
 // getUserBalance: new Subject();
  userBalance = new EventEmitter();
  user_balance = {total_amount: 0, real_amount: '', winning_amount: '', bonus_amount: '',  point_balance: ''};
   currentUser;
   session;
  constructor(private service: AuthloginService, private utilityservice: UtilityService) {
    if (this.utilityservice.getLocalStorage('user')) {
    this.currentUser = this.utilityservice.getLocalStorage('user');
    this.session = this.currentUser.data.session_key;
    }
   // console.log(this.utilityservice.getLocalStorage('user'));
  }

   getTransactionAmount() {
   const param = {
        'user_id' :  this.currentUser.data.user_profile.user_id
    };
  this.service.api('user/finance/get_user_balance', param, 'POST', this.session)
  .subscribe((response) => {
        if (response.response_code === 200) {
            response = response.data;
            this.user_balance = response.user_balance;
            this.user_balance.total_amount =
             parseFloat(this.user_balance.real_amount)
             + parseFloat(this.user_balance.winning_amount)
             + parseFloat(this.user_balance.bonus_amount);
            // emit('user:update_balance', this.user_balance.real_amount);
            this.userBalance.emit(this.user_balance);
            // console.log(param);
            return this.user_balance;
        }
    },  (error) => {
        if (error.global_error){
          // emitAlert.on(error.global_error, 'danger');
        }
    });
    return this.user_balance;
}

}
