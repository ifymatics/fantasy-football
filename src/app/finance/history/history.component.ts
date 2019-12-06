import { AuthloginService } from 'src/app/user/authlogin.service';
import { UtilityService } from './../../utility.service';
import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  clickedIndex: Number;
  act = '';
  mobile = false;
  offset = 0;
   limit = 20;
   isLoadMore = false;
   disableLoadMore   = true;
   userAccHistories = [];
   selectedSport;
   season_type = 2;
   posting  = false;
   currentUser;
   emptyScreen;
   session;
   isLoading = false;
   league_detail = {'background_image': ''};

   user_balance;

  constructor(private utilityservice: UtilityService, private service: AuthloginService) { }

  ngOnInit() {
    this.selectedSport = this.utilityservice.getLocalStorage('selectedSport');
    this.currentUser = this.utilityservice.getLocalStorage('user');
   
    this.session = this.currentUser.data.session_key;
    if (this.selectedSport.format_type === 'seasonlong') {
      this.season_type = 2;
     } else if (this.selectedSport.format_type === 'daily') {
      this.season_type = 1;
     } else if (this.selectedSport.format_type === 'snakedraft') {
      this.season_type = 3;
     }
     this.getTransactionHistory();
     this.getTransactionAmount();

  }
  toggleHistoryInfo(index) {
    if (index >= 0) {
      this.clickedIndex = index;
      // console.log(i);
      this.mobile = !this.mobile;
    }
  }
  getTransactionHistory() {
    this.isLoading = true;
    this.posting  = true;
    this.disableLoadMore = true;
    const  param = {
        'user_id' : this.currentUser.data.user_profile.user_id,
        'offset' :  this.offset,
        'season_type' : 1, //this.season_type,
        'limit' : this.limit
    };
   this.service.api('user/finance/get_transaction_history', param, 'POST', this.session)
   .subscribe((response) => {
        if (response.response_code === 200) {
          this.isLoading = false;
       // console.log(response);
          // console.log(this.selectedSport);
         // console.log(param);
            response = response.data;
            const transactionHistoryData = response.transaction_history;
            for (const index in transactionHistoryData) {
                if (transactionHistoryData[index].type === 0) {
                    transactionHistoryData[index].credit_amnt =
                    parseFloat(transactionHistoryData[index].real_amount) +
                     parseFloat(transactionHistoryData[index].bonus_amount) +
                    parseFloat(transactionHistoryData[index].winning_amount);
                    transactionHistoryData[index].debit_amnt = 0;
                } else {
                    transactionHistoryData[index].credit_amnt = 0;
                    transactionHistoryData[index].debit_amnt =
                     parseFloat(transactionHistoryData[index].real_amount) +
                     parseFloat(transactionHistoryData[index].bonus_amount) +
                     parseFloat(transactionHistoryData[index].winning_amount);
                }
            }
            this.userAccHistories = this.userAccHistories.concat(transactionHistoryData);
            this.emptyScreen = (this.userAccHistories.length) ? false : true;
            this.isLoadMore = response.is_load_more;
            this.disableLoadMore = false;
            this.offset = response.offset;
           // console.log( this.userAccHistories);
           // console.log( this.currentUser);
        }
        this.posting  = false;
    }, function (error) {
      this.isLoading = false;
        if (error.global_error) {
          alert(error.global_error);
          // emitAlert.on(error.global_error, 'danger');
        this.posting = false;
        }
    });
}
getTransactionAmount() {

  const param = {
      'user_id' : this.currentUser.data.user_profile.user_id
  };
  this.service.api('user/finance/get_user_balance', param, 'POST', this.session)
  .subscribe((response) => {
      if (response.response_code === 200) {
          response = response.data;
        //  console.log(response.user_balance);
         this.user_balance = response.user_balance;
         this.user_balance.total_amount =
         parseFloat(this.user_balance.real_amount) +
         parseFloat(this.user_balance.winning_amount) +
          parseFloat(this.user_balance.bonus_amount);

          // Update balance
         // $rootScope.$emit('user:update_balance',this.user_balance.real_amount);
      }
  },  (error) =>{
      if (error.global_error) {
        alert(error.global_error);
        // emitAlert.on(error.global_error, 'danger');
      }
  });
}
getTimestamp(dateTime) {
  const formatted = this.utilityservice.getTimestamp(dateTime);

  return formatted;
}

}
