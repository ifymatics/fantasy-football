import { Component, OnInit, ViewChild } from '@angular/core';
import { LeaguesService } from '../leagues.service';
import { UtilityService } from 'src/app/utility.service';
import { timingSafeEqual } from 'crypto';
import { ModalDirective } from 'angular-bootstrap-md';
import { AuthloginService } from 'src/app/user/authlogin.service';

@Component({
  selector: 'app-predictboard',
  templateUrl: './predictboard.component.html',
  styleUrls: ['./predictboard.component.scss']
})
export class PredictboardComponent implements OnInit {
userPoints = [];
userId;
session;
isLoading;
Rank = [];
userScoredGame = [];
userScoredTokenGame = [];
userScoredFreeGame = [];
user = [];
index;
currentUser;
userr;
token = false;
toggledIdArray = [];
freeIsActive;
tokenIsActive;
@ViewChild('userResult', { static: true })userResult:ModalDirective;
  constructor(private leaguesService: LeaguesService, private utils: UtilityService, private service:AuthloginService) { }

  ngOnInit() {
  
    //console.log('helloooo')
    this.freeIsActive = true;
    this.currentUser = this.utils.getLocalStorage('user');
    this.session =  this.currentUser.data.session_key;
     this.userId = this.currentUser.data.user_profile.user_id;
   
    this.getPredictwinBoardPoints();
    // this.leaguesService.getUserPoint().subscribe(
    //   data => { 
      
    //    this.user = data.filter(user=>user.id ===this.userId);
    //    this.index = this.user.length>0? data.indexOf(this.user[0]):'';
    //     this.Rank = data;
    //     console.log(this.user)
    //   }
    // );
  }
  getPredictwinBoardPoints(){
    this.isLoading = true;
    let param ={ type: 'all'}
    this.service.api('user/finance/get_predictwin_points',param,'POST',this.session).subscribe( 
    data => { 
      
      if(data.data !== null){
        this.user = data.data.filter(user=>user.user_id ===this.userId);
        this.index = this.user.length>0? data.data.indexOf(this.user[0]):'';
         this.Rank = data.data;
        // console.log(this.user)
       
      }
      this.isLoading = false;
       //console.log(this.user)
     },
     error=>{console.log(error);  this.isLoading = false;}
   );

  }
  showUserResult(user){
   // console.log(user)
    this.isLoading = true;
   this.userr = user;
   let userId = user.user_id
   this.leaguesService.getUserScoredGames(userId).subscribe(data=>{ this.userScoredFreeGame=data;this.showResult();});
   this.leaguesService.getUserTokenScoredGames(userId).subscribe(data=>{ this.userScoredTokenGame=data;});
  
  
  }
  showResult(){
    this.isLoading = false;
    this.userResult.show()
  }
  cancel(){
    this.token = false;
    this.userResult.hide()
  }
  onClickToken(){
   
    this.token = true;
  }
  onClickFree(){
    this.token = false;
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
}
