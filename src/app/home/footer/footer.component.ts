import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  dropdownState: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  toggleDropdown() {
    this.dropdownState = !this.dropdownState;
  }

}
