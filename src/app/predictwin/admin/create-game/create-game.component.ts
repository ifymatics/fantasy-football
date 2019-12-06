import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PredictwinService } from '../../predictwin.service';
import { UtilityService } from 'src/app/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {
  gameForm;
  leagues = [];
  session;
  userId;
 adminIds = ['1','2','3','4','6','28'];
  constructor(private predictwinService: PredictwinService,
     private utils: UtilityService, private router:Router) { }

  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    // if(!this.adminIds.includes(this.userId)){  this.router.navigate(['/home']);}
   // this.fetchLeagues();
  }
//    fetchLeagues(){
//  this.predictwinService.fetchAllLeagues().subscribe(
//   data => {this.leagues = data;
//            console.log(this.leagues);
//           }
//    );

//  }
}
