import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  contestListData = [];
  isLoading = false;
  constructor() { }

  ngOnInit() {
  }

}
