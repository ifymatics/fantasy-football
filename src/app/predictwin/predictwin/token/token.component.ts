import { Component, OnInit } from '@angular/core';
import { LeaguesService } from '../../leagues.service';
import { PredictwinService } from '../../predictwin.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/utility.service';
import { FanshopService } from 'src/app/fanshop/fanshop.service';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
export class gameObj {
  id?:string;
  title?: string;
  game?: object;
  entry_fee?:string;
  league_id?:string;
  prize?:string;
  date: string;
  ID:string;
}
@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  dropdownToggle = false;
  isLoading;
  tokenGames = [];
  predictedGames = [];
  filteredTokenGame = [];
  myPredictedTokenGames = [];
  filtered = [];
  session;
  userId;
  buttons = [
    {name: 'Home', marked: false},
    {name: 'Draw', marked: false},
    {name: 'Away', marked: false}
  ];
  subscription: Subscription
  toggledId = [];
  error;
  tag;
  entry_fee = 0;
  removedTokenGames = [];
  //attachToHeader = new EventEmitter<boolean>();
  tokenModalObj = {action: false, url: ''};
  user_balance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0, token: 0};
  constructor(private leaguesService: LeaguesService,
    private predictwinService: PredictwinService,
    private router: Router, private utils: UtilityService) { }

  ngOnInit() {
   // this.checkGameDate()
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.isLoading = true;
    let nowTimeStamp = Date.now();
    this.leaguesService.user_balanceEmitter.subscribe(data=>this.user_balance=data);
    this.leaguesService.tokenLeagueEmitter.subscribe(
      data => {
        if(data){
          this.tokenGames = []; 
          this.tokenGames = data;
        }
      }
    );
    this.leaguesService.fetchToken('front-end', nowTimeStamp).subscribe(
      data => {
        if(data){
         
          this.tokenGames = [];
          this.tokenGames = data;
        }
      }
    );
  
    //this.fetchAllGames();
    this.leaguesService.clearGamesArray.subscribe(
      data => {
        if (data === 'tokenGames')
        this.predictedGames = [];
        // this.leaguesService.clearGamesArray.emit('freeGamesCleared');

      } 

    );
    this.fetchSubmittedResults();
  }
  fetchAllGames(){
    this.predictwinService.fetchAllGames('token', true).subscribe(
     data => {this.tokenGames = data; this.isLoading = false;}
    );
  }
  checkGameDate(date?){
    let now = Date.now();
    const time = new Date().getTimezoneOffset()*60*1000 ;
     now = Date.now()-time;
     let gameDate = date;
     if(gameDate>now){ 
    
       return true;
      }
     return false;
   }
  
  toggleDropdown(gameArrayId, gameArrayIndex){
   if(this.checkGameDate(this.tokenGames[gameArrayIndex].date)){
    if( this.toggledId.includes(gameArrayId)){
      const index = this.toggledId.indexOf(gameArrayId);
       this.toggledId.splice(index,1)
      // this.dropdownToggle = false;
    this.predictedGames = [];
    //console.log(this.toggledId);
    this.leaguesService.tokenGamesObj.emit(this.predictedGames);
    }else{
      this.predictedGames = [];
    this.leaguesService.tokenGamesObj.emit(this.predictedGames);
      this.toggledId.push(gameArrayId);
    
    }
   }else{
    this.tag = 'danger';
    this.error = 'You Can No Longer Predict this game, it has already started!';
   }
    
  
  }
 
    onPredict(gameArrayIndex,gameIndex, btn){
       
      if(this.checkGameDate(this.tokenGames[gameArrayIndex].date)){
        const predictedGameObj = {} as gameObj;
        if (this.predictedGames.indexOf(this.tokenGames[gameArrayIndex].games[gameIndex])=== -1) {
          
             const game = this.tokenGames[gameArrayIndex].games[gameIndex];
             btn.marked = true;
             game.id = this.tokenGames[gameArrayIndex].id
             game['button'] = btn;
             game['scored'] = false;
             game['result'] = false;
             this.filterGameResult(gameArrayIndex ,gameIndex);
              this.predictedGames[gameIndex] = game;
     
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
         const tokenGames = this.tokenGames[gameArrayIndex].games.filter(value => Object.keys(value).length !== 0);
       
         this.leaguesService.tokenGamesObj.emit(predictedGames);
        
         if(predictedGames.length === tokenGames.length){
           
           predictedGameObj.ID = this.tokenGames[gameArrayIndex].id;
           predictedGameObj.title = this.tokenGames[gameArrayIndex].title;
           predictedGameObj.league_id = this.tokenGames[gameArrayIndex].league_id;
           predictedGameObj.prize = this.tokenGames[gameArrayIndex].prize;
           predictedGameObj.entry_fee = this.tokenGames[gameArrayIndex].entry_fee;
           predictedGameObj.date = this.tokenGames[gameArrayIndex].date;
           predictedGameObj.game =this.predictedGames;
           predictedGameObj['length'] = this.predictedGames.length;
           predictedGameObj['token'] =true;
           predictedGameObj['scored'] = false;
           predictedGameObj['datePredicted'] = Date.now();
          // console.log(this.predictedGames.length);
           // alert(this.tokenGames[gameArrayIndex].games.length);
            this.leaguesService.tokenGamesArray.emit(predictedGameObj);
           // console.log('i am here!!!');
        }
         
      }else{
        this.tag = 'danger';
        this.error = 'You Can No Longer Predict this game, it has already started!';
     }
   
     
    }
    fetchSubmittedResults(){
       //this.leaguesService.getUserPredictions(this.userId, '','token').subscribe(
        this.leaguesService.getUserTokenPredictionsForScoring(this.userId).subscribe(
       results => {
        this.myPredictedTokenGames = results;
        this.myPredictedTokenGames.slice().forEach(data=> this.removedTokenGames.push(data.ID))
         this.filterGameResult();
       // this.filter();
       //this.ike()
       }
      );
    }
    filterGameResult(gameArrayIndex? ,gameIndex?){
     // console.log(gameArrayIndex,gameIndex);
      let count = 0;
     
      let array = [];
     
     let  dGame = []; 
     let   elebe = [];
      let zobo = [];
      let  kai = [];
      if(  this.filteredTokenGame.length>0){ 
       // console.log(  this.filteredTokenGame[gameArra]);
      if(typeof gameArrayIndex=== 'number' && typeof gameIndex === 'number'){
        if( this.filteredTokenGame[gameArrayIndex])
        this.filteredTokenGame[gameArrayIndex][gameIndex].button.marked = false;
       
      }
     } else {
        if(this.myPredictedTokenGames.length>0){
      
          for(let result in this.tokenGames ){ 
            if(count<this.myPredictedTokenGames.length){
          const game =  this.myPredictedTokenGames.find(resul=>{
              if(this.tokenGames[result].id ===resul.id)
              return resul;
            });
            if(game === undefined){
             continue;
            }else {
              array[result] = game;
            }
           
           
           count++;
           
         
              if(count===this.myPredictedTokenGames.length)
              break;
                
          }
         
        }
         } 
         this.filtered = array;
        // console.log(this.filtered);
         let ToCount = 0;
            if(this.filtered.length>0){ 
              for(let gameI in this.tokenGames){
                for(let fetched of this.filtered){
                 // for(let fetch of fetched.game){
                  // console.log(fetched.id);
                  if(fetched !== undefined){ 
                  if(fetched.id ===  this.tokenGames[gameI].id ){
                      dGame = [];
                      elebe = [];
                      zobo = [];
                    for(let gameIndex in  this.tokenGames[gameI].games){
                      const gam =  fetched.game.find(resul=>{
                      if( this.tokenGames[gameI].games[gameIndex].home ===resul.home
                        &&  this.tokenGames[gameI].games[gameIndex].away ===resul.away)
                      return resul;
                    });
                   // if(gam){
                    
                      dGame[gameIndex]= gam;
                      elebe[gameI] = dGame;
                      if(elebe.length>0 && !elebe.includes(dGame)){
                       //this.filt = elebe.concat(elebe);
                       elebe = elebe.concat(elebe);
                       // console.log( elebe);
                      }else { 
                        kai[gameI]=dGame
                        // console.log(kai);
                        }
                  }
                 
                 //break;
                 }  //else {break;}
                }
              }
           /// function to grab tokenGames.games index
             }
            }
             this.filteredTokenGame = kai;
          
      }
     
    
    }
    removeAlreadyPredictedGames(gameArrayIndex? ,gameIndex?){
     // console.log(this.removedTokenGames);
       
       if( this.myPredictedTokenGames.length>0){ 
        // console.log(  this.filteredTokenGame[gameArra]);
       if(typeof gameArrayIndex=== 'number'){
         if(this.removedTokenGames.includes(this.tokenGames[gameArrayIndex].id))
         //this.tokenGames.splice(gameArrayIndex,1);
        return false;
       }else{
         return true;
       }
      
      }
      return true;
     }
}
