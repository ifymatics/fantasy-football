import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/utility.service';


@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrls: ['./new-home.component.scss']
})
export class NewHomeComponent implements OnInit {
 homeRoute;
  constructor(private router: Router, private utilityservice: UtilityService) { }

  ngOnInit() {
    this.homeRoute = this.router.isActive('/home', true);
  }
  onNavigate(arg){
    if (arg === 'league') {
     return this.router.navigate(["5/league"]);
    }

  }

}
