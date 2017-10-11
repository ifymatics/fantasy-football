import { Injectable } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
LoginModal: ModalDirective;
SignupModal: ModalDirective;
  constructor() { }
  setLogin(modal: ModalDirective) {
    this.LoginModal = modal;
  }
  setSignup(modal: ModalDirective) {
    this.SignupModal = modal;
  }
  showLogin() {

    this.LoginModal.show();
    }
    hideLogin() {

      this.LoginModal.hide();
      }
    showSignup() {

      this.SignupModal.show();
      }
      hideSignup() {

        this.SignupModal.hide();
        }
}
