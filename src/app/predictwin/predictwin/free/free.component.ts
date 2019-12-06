import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { PredictwinService } from '../../predictwin.service';
import { LeaguesService } from '../../leagues.service';
import { empty } from 'rxjs';
import { UtilityService } from 'src/app/utility.service';
import * as moment from 'moment';

class Buttons{
  name?:string;
  marked?:boolean;
}
@Component({
  selector: 'app-free',
  templateUrl: './free.component.html',
  styleUrls: ['./free.component.scss']
})
export class FreeComponent implements OnInit {
  freeGames = [];
  predictedGames = [];
  predicted = [];
  isLoading = false;
  marked;
  gameObj = '';
  user_balance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0, token: 0};
  buttons: Buttons[] = [
    {name: 'Home', marked: false},
    {name: 'Draw', marked: false},
    {name: 'Away', marked: false}
  ];
  buttonObj: Buttons;
  gameArray = [];
  removedFreeGames = [];
 // gamesWithResults = [];
  submittedGamesResult = [];
  filteredFreeGame = [];
  userId;
  user;
  session;
 error;
 tag;
 entry_fee = 0;
  constructor(private leaguesService: LeaguesService,
    private predictwinService: PredictwinService, private utils: UtilityService,
    private router: Router) { }

  ngOnInit() {
  
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.isLoading = true;
  
    this.user = {userId: this.userId, username:user.data.user_profile.user_name};
   // console.log(this.user)
    //this.fetchSubmittedResults();
    let nowTimeStamp = Date.now();
    this.leaguesService.fetchFree('front-end', nowTimeStamp).subscribe(
      data => {
        if(data){
         
          this.freeGames = [];
          this.freeGames = data;
          this.fetchSubmittedGames();
          this.isLoading = false;
         
        }
      }
    );
    this.predictwinService.gamesEmitter.subscribe(
      data => {
        if(data){
          this.freeGames = [];
         this.freeGames = data;
        
         this.fetchSubmittedGames();
        }
      }
    );
    this.ListeningToAllFreeGamesEmitter();
    this.leaguesService.clearGamesArray.subscribe(
      data => {
        if (data === 'freeGames')
        this.predictedGames = [];
       
        // this.leaguesService.clearGamesArray.emit('freeGamesCleared');

      } 

    );
    this.fetchSubmittedGames();
   // this.deductEntryFee(this.user_balance)
  }
  checkGameDate(date){
    let now = Date.now();
    const time = new Date().getTimezoneOffset()*60*1000 ;
     now = Date.now()-time;
    let gameDate = date;
    if(gameDate>now)return true;
    return false;
   
  }
  ListeningToAllFreeGamesEmitter(){
    this.predictwinService.freeEmitter.subscribe(
      data => {
        if(data){
         // this.freeGames = [];
         this.freeGames = data;
         //console.log(  this.freeGames);
        }
      }
    );
  }
  fetchSubmittedGames(){
  
    // this.leaguesService.getUserFreePredictionsForScoring(this.userId).subscribe(
    //   results => {   this.submittedGamesResult = results;
    //    this.leaguesService.emitSubmittedGames.emit(results);
    //    //this.filterGameResult();
    //   }
    //  );

     this.leaguesService.getUserFreePredictionsForScoring(this.userId).subscribe(data=>{ 
    //this.leaguesService.emitSubmittedGames.subscribe(data=>{
      this.submittedGamesResult=data;
      this.submittedGamesResult.slice().forEach(data=> this.removedFreeGames.push(data.ID))
    })
  }
  closeAlert() {
    this.error = null;
    }
  onPredict(gameIndex, index, btn){ 
     if( this.checkGameDate(this.freeGames[gameIndex].date)){
       //if(!this.deductEntryFee(this.freeGames[gameIndex])){

     
        if (this.predictedGames.indexOf(this.freeGames[gameIndex])=== -1) {
          const game = this.freeGames[gameIndex];
          btn.marked = true;
          game.datePredicted = Date.now();
           game['button'] = btn;
           game['scored'] = false;
           game['result'] = false;
           game['user'] = this.user;
           game['free'] = true;
           game['ID'] =    game['id'];
          this.filterGameResult(game);
           this.predictedGames[gameIndex] = game;
          //console.log(game);
  
      } else {
      
        for (const game of this.predictedGames) {
       if(this.predictedGames.indexOf(game)=== gameIndex){
        btn.marked = true;
        game.button = btn;
        break;
       }
      }
        
      }
      const predictedGames = this.predictedGames.filter(value => Object.keys(value).length !== 0);
    
      this.leaguesService.freeGamesArray.emit(predictedGames);
      
     
     }else{
      this.tag = 'danger';
       this.error = 'You Can No Longer Predict this game, it has already started!';
      // alert('You Can No More Predict this game, it has already started!')
     }
   
  }
  filterGameResult(Game?){
   if(this.freeGames.length>0)
    for(let gameIndex in this.freeGames)
    if(this.submittedGamesResult.length>0){
     // console.log(this.submittedGamesResult)
     for(let game of this.submittedGamesResult){
       if(game.ID===this.freeGames[gameIndex].id){
        this.filteredFreeGame[gameIndex]= game;
        if(Game){ 
         // console.log(Game);
        if(game.ID === Game.ID ){ 
        this.filteredFreeGame[gameIndex].button.marked = false;
       
        break;
        }
        }
        //this.filteredFreeGame[gameIndex];
       
       }
      
     }
    }
  }
  

}
