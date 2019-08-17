import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  dropdownToggle;
  toggleDropdown;
  constructor() { }

  ngOnInit() {
  }

}
