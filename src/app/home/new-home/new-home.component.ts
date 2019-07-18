import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrls: ['./new-home.component.scss']
})
export class NewHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  onNavigate(arg){
    if (arg === 'league') {
     return this.router.navigate(["5/league"]);
    }

  }

}
