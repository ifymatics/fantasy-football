import { Injectable } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  emitModal = new EventEmitter< ModalDirective>();
LoginModal: ModalDirective;
SignupModal: ModalDirective;
joinGameConfirmModal: ModalDirective;
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
      showJoinConfirm(param?) {
        if (param === 'hide') {
          this.joinGameConfirmModal.hide();
        } else {
          this.joinGameConfirmModal.show();
        }

        }
      hideSignup() {

        this.SignupModal.hide();
        }
}
