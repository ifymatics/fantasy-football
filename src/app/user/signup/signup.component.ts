import { SignupError } from './signupError.model';
import { md5 } from './../md5';
import { AuthloginService } from './../authlogin.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from './../../modal.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { $ } from 'protractor';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild('SignUpmodal') SignUpmodal: ModalDirective;
  @ViewChild('signupSuccessModal') signupSuccessModal: ModalDirective;
  @ViewChild('date') date: ElementRef;

  signupForm;
  queryObj = {  referal_code: ''};
  signupObj = {
     first_name: '',
    last_name: '',
    email: '',
    password: '',
    dob: '',
    device_type: 3,
    referal_code: ''
  };
  signupError: SignupError ;

  constructor( private _modalservice: ModalService,
               private service: AuthloginService) { }

  ngOnInit() {
    this._modalservice.setSignup(this.SignUpmodal);
    this.signupForm = new FormGroup({
      'firstname': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
      'date': new FormControl(null, Validators.required),
      't&c': new FormControl(null, Validators.required)
    });
  }
  showlogin() {
    this._modalservice.hideSignup();
    this._modalservice.showLogin();
  }
  submitSignup() {
    let  signupObj = {
      first_name: this.signupForm.value.firstname,
      last_name: this.signupForm.value.lastname,
      email: this.signupForm.value.email,
      password: md5(this.signupForm.value.password),
      dob: this.dateHandler(this.signupForm.value.date),
      device_type: 3,
      referal_code: ''
    };
    if (this.queryObj.referal_code !== '') {
      signupObj.referal_code = this.queryObj.referal_code;
    }
    // console.log(signupObj);
    this.service.api('user/auth/signup', signupObj, 'signup' ).
    subscribe((response) => {
      if (response.response_code === 200) {
        signupObj = this.signupObj;
        this.signupError = {} as SignupError;
        this.signupForm.reset();
        this.signupSuccessModal.show();
        // console.log(response);
      }
    }, (error) => {
       console.error(error.error.error);
       this.signupError = error.error.error ;
        console.log(this.signupError);
    });

  }
  disabled(data) {
    const date = data.date
      , mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
}
  dateHandler(dateStr) {
    const dateFormat = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May',
      '06': ' Jun',  '07': 'Jul',  '08': 'Aug', '09': ' Sep', '10': ' Oct',
      '11': ' Nov', '12': ' Dec'
    };
   //  console.log(JSON.stringify(this.signupForm.value.date));
    const dateString = this.signupForm.value.date;
   //  dateString.split(" ");
    const dateArray = dateString.split('-');
    const dob = dateFormat[dateArray[1]] + ' ' +  dateArray[2] + ',' + ' ' +  dateArray[0];
    console.log(dob);
    return dob;
  // e.target.pickdate();
  }

}
