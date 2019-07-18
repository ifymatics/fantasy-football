import { Component } from '@angular/core';
import { UtilityService } from './utility.service';
import { AuthloginService } from './user/authlogin.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private utilityservice: UtilityService, private service: AuthloginService) {

  }
  logout() {
    console.log('from eventemitter');
     this.service.logout();
   }
}
