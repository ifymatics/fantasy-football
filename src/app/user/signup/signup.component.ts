import { ModalService } from './../../modal.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild('SignUpmodal') SignUpmodal: ModalDirective;

  constructor( private _modalservice: ModalService) { }

  ngOnInit() {
    this._modalservice.setSignup(this.SignUpmodal);
  }
  showlogin() {
    this._modalservice.hideSignup();
    this._modalservice.showLogin();
  }
}
