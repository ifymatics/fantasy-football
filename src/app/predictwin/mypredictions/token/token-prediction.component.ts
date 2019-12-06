import { Component, OnInit } from '@angular/core';
import { LeaguesService } from '../../leagues.service';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-token-prediction',
  templateUrl: './token-prediction.component.html',
  styleUrls: ['./token-prediction.component.scss']
})
export class TokenPredictionComponent implements OnInit {
  dropdownToggle = false;
  userTokenPredictions = [];
  user;
  toggledIdArray = [];
session;
userId;
isLoading = false;
  constructor(private leaguesService: LeaguesService, private utils: UtilityService) { }

  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.isLoading = true;
    this.getAllTokenPredictions();
  }
  toggleDropdown(gameArrayId, index?){
  
   if( this.toggledIdArray.includes(gameArrayId)){
    const index = this.toggledIdArray.indexOf(gameArrayId);
     this.toggledIdArray.splice(index,1)

 // this.leaguesService.tokenGamesObj.emit(this.predictedGames);
  }else{
    
  //this.leaguesService.tokenGamesObj.emit(this.predictedGames);
    this.toggledIdArray.push(gameArrayId);
  
  }
  }
 
  getAllTokenPredictions(){
    
    // this.leaguesService.getUserPredictions(this.userId, '', 'token').subscribe(
    //   data =>  {this.userTokenPredictions = data;}
    // );
    this.leaguesService.getUserTokenPredictionsForScoring(this.userId).subscribe(data=>{this.userTokenPredictions = [];this.userTokenPredictions = data; this.isLoading = false })
   }
}
