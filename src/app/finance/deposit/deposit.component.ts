import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthloginService } from './../../user/authlogin.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UtilityService } from './../../utility.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
  currentUser;
  isLoading = false;
  league_datum;
  paymentStatus = {status: ''};
  is_loading = false;
  params = { amount: '', subscription: ''};
  session;
  depositForm;
  user_balance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, total_amount : 0};

  constructor(private utilityservice: UtilityService,
              private router: Router, private route: ActivatedRoute,
              private service: AuthloginService) { }

  ngOnInit() {

    const user          =     this.utilityservice.getLocalStorage('user');
    this.currentUser    =     user.data.user_profile;
    this.session = user.data.session_key;
  this.league_datum     =     this.utilityservice.getLocalStorage('league').league_id;
  this.route.params.subscribe(
    (params: ParamMap) => {
      this.params.amount = params['amount'] ?
                           params['amount'] : (params['subscription'] ?
                                                   params['subscription'] : '' );
    }
  );
    this.route.queryParams.subscribe(
    (queryParams) => {
      this.paymentStatus.status = queryParams['status'];
    }
   );
   if (this.paymentStatus.status !== '') {
    if (this.paymentStatus.status === 'success' || this.paymentStatus.status === 'completed' ) {

                // emitAlert.on("Fund added successfully", 'success');
    } else if (this.paymentStatus.status === 'subscribed') {
    const data = {
                'user_id': this.currentUser.user_id,
                'league_id': this.utilityservice.getLocalStorage('league').league_id
               };
   } else if (this.paymentStatus.status === 'failure') {
       // emitAlert.on("Payment failure. Try again !!", 'danger');
    } else if (this.paymentStatus.status === 'pending') {
       // emitAlert.on("Your request has been sent to paypal, your order status will update soon.", 'info');
    }
   }
   this.depositForm = new FormGroup({
     'amount': new FormControl(this.params.amount, Validators.required),
   });
  }
  deposit(subscription?) {
    this.isLoading = true;
   // console.log(this.depositForm.value);
   const furl = window.location.href.split('?')[0] + '?status=failure',
    surl = window.location.href.split('?')[0] + '?status=success',
    spurl = window.location.href.split('?')[0] + '?status=pending';
    this.is_loading = true;
    const param = {
        'amount': this.depositForm.value.amount,
        'sports_id': 5
    };
    let url = 'user/paystack/deposit';
    if (subscription === 'subscription') {
      url = 'user/paystack/subscription';
    }
    this.service.api(url , param, 'POST', this.session)
    .subscribe(function(response) {
        if (response.response_code === 200) {
          this.isLoading = false;
           window.location.href = response.data.authorization_url;
           this.is_loading = false;
        }
    }, (error) => {
        this.is_loading = false;
        // emitAlert.on(display, 'danger');
    });
  }

}
