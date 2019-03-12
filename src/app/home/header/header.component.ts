import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { AuthloginService } from './../../user/authlogin.service';
import { UtilityService } from './../../utility.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
id;
league_id;
blue = false;
toggle = false;
mobile = false;
menuHeader = '';
menuHeaderArrray = [];

  constructor(private utilityservice: UtilityService,
     private service: AuthloginService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // this. showMenu();
    this.route.params.subscribe(
      (params: ParamMap) => {
         this.id = +params['id'];
         this.league_id = params['league_id'];
         console.log(this.league_id);
      }
    );
  }
  showMenu() {
    // this.menuHeader = '';
    if (this.menuHeader === 'open') {
      this.menuHeader = '';
    } else {
      this.menuHeader = 'open';
    }
  //  this.menuHeaderArrray.push(this.menuHeader);
   console.warn(this.menuHeader);
 }
  logout() {
    this.service.logout();
  }
  onNavigate() {
    this.router.navigate([this.id + '/lobby']);
  }
}
