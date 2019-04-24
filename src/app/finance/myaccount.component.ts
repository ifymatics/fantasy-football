import { UtilityService } from './../utility.service';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyaccountComponent implements OnInit {
  user_balance = {real_amount: '', winning_amount: '',
   bonus_amount: '', total_amount: 0, point_balance: ''};
  currentUser;
  session;
  constructor(private service: AuthloginService,
              private utilityservice: UtilityService,
              private dataservice: DataService) { }

  ngOnInit() {
    this.currentUser = this.utilityservice.getLocalStorage('user');

    this.session = this.currentUser.data.session_key;
    this.getTransactionAmount();
  }
  getTransactionAmount() {
  // this.user_balance = this.dataservice.getTransactionAmount();

    const param = {
        'user_id' : this.currentUser.data.user_profile.user_id
    };
    this.service.api('user/finance/get_user_balance', param, 'POST', this.session)
    .subscribe((response) => {
        if (response.response_code === 200) {
            response = response.data;
            console.log(response.user_balance);
           this.user_balance = response.user_balance;
           this.user_balance.total_amount =
           parseFloat(this.user_balance.real_amount) +
           parseFloat(this.user_balance.winning_amount) +
            parseFloat(this.user_balance.bonus_amount);

            // Update balance
           // $rootScope.$emit('user:update_balance',this.user_balance.real_amount);
        }
    }, function (error) {
        if (error.global_error) {
          alert(error.global_error);
          // emitAlert.on(error.global_error, 'danger');
        }
    });
  }

}
