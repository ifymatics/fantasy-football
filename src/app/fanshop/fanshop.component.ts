import { Component, OnInit } from '@angular/core';
import { UserService } from './shared/services/user.service';
//import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-fanshop',
  templateUrl: './fanshop.component.html',
  styleUrls: ['./fanshop.component.scss']
})
export class FanshopComponent implements OnInit {

  constructor(private userService: UserService, private auth: AuthService, router: Router) {
    auth.user$.subscribe(user => {
      if (!user) return; 

      userService.save(user);

      let returnUrl = localStorage.getItem('returnUrl');
      if (!returnUrl) return; 

      localStorage.removeItem('returnUrl');
      router.navigateByUrl(returnUrl);
    });
  }

  ngOnInit() {
  }

}
