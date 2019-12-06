import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/utility.service';
import { LeaguesService } from '../leagues.service';

@Component({
  selector: 'app-mypredictions',
  templateUrl: './mypredictions.component.html',
  styleUrls: ['./mypredictions.component.scss']
})
export class MypredictionsComponent implements OnInit {

  user;
session;
userId;
userFreePredictions = [];
isLoading = false;
  constructor(private utils: UtilityService, private leaguesService: LeaguesService) { }


  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.isLoading = true;
    //this.getUserFreePredictions();
  }
 
  // getUserTokenPredictions(){
  //   this.leaguesService.getUserPredictions(this.userId, '').subscribe(
  //     data =>  this.leaguesService.myTokenPredictionsEmitter.emit(data)
  //   );
  // }

}
