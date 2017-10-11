import { AuthloginService } from './../../user/authlogin.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit {
  leagueList       = [];
 data = {sports_id: '5'};
  constructor(private router: Router, private service: AuthloginService) { }

  ngOnInit() {
this.service.api('fantasy/sl_lobby/get_daily_sl_leagues', this.data, 'POST')
.subscribe(data => {
  console.log(data);
},
 error => console.log(error)
);
  }

}
