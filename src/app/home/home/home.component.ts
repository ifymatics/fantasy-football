import { ModalService } from './../../modal.service';
import { md5 } from './../../user/md5';
import { Component, OnInit, Output , EventEmitter} from '@angular/core';
import { AuthloginService } from '../../user/authlogin.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { EventEmitter } from 'events';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private _modalservice: ModalService) { }

  ngOnInit() {
  }
  showModal(modal) {
    if (modal === 'loginmodal') {
     this._modalservice.showLogin();
    } else if (modal === 'signupmodal') {
      this._modalservice.showSignup();
    }
  }
  validateForgotCode = function() {
    const forgotCodeObj = {
         'key': this.queryObj.key
     };
   this.service.api('user/auth/forgot_password_validate_code', forgotCodeObj, 'POST')
   .subscribe((response) => {
         if (response.response_code === 200) {
            // vm.ResetPwdModalInit();
         }
     }, (error) => {
         // alert((error.error['key']) ? error.error['key'] : MessageService.getMessage('session_expired'), 'danger');
     });
 }
 ;
}
