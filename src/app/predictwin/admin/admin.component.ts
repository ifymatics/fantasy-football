import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaguesService } from '../leagues.service';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
 
  constructor(private router:Router) { }

  ngOnInit() {
    
    const routers = this.router.url;
    console.log(routers.split('/')[2]);
  }
   onNavigate(page){
     if (page === 'create-game') {
      this.router.navigate(['/create-game']);
     }
    
   // routerLink="/create-game"
   }
}
