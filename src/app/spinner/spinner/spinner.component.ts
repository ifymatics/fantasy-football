import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
@Input() isLoading
  constructor() { }

  ngOnInit() {
   // console.log(this.isLoading)
  }

}
