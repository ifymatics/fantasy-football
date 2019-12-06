import { Component, OnInit, Input } from '@angular/core';
import { PredictwinService } from 'src/app/predictwin/predictwin.service';
import { LeaguesService } from 'src/app/predictwin/leagues.service';
import { Router } from '@angular/router';
import { gameObj } from 'src/app/predictwin/predictwin/token/token.component';
import { filter } from 'rxjs/Operators';
import { IfStmt } from '@angular/compiler';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-manage-token',
  templateUrl: './manage-token.component.html',
  styleUrls: ['./manage-token.component.scss']
})
export class ManageTokenComponent implements OnInit {
  dropdownToggle = false;
 tokenGames = [];
 leagues  = [];
 submittedGamesResult = [];
 filteredTokenGame = [];
 gamesWithResults = [];
 predictedGameObj = [];
 toggledId = [];
 filteredArray = [];
 filtered = [];
 filt = [];
 session;
  userId;
  active = '';
  adminIds = ['1','2','3','4','6','28'];
 buttons = [{name:'Home',  marked: false},{name:'Draw',  marked: false},{name:'Away',  marked: false}];
 
 isLoading;
  constructor(private predictwinService: PredictwinService,
    private leagueService: LeaguesService,private router:Router,  private utils: UtilityService) { }

  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
     //if(!this.adminIds.includes(this.userId)){  this.router.navigate(['/home']);}
    this.isLoading = true;
 
    this.predictwinService.gamesEmitter.subscribe(
       data => {
         if(data){
           this.tokenGames = [];
           this.tokenGames = data;
         }
       }
     );
   this.fetchAllGames();
   this.fetchSubmittedResults();
  }
  fetchAllGames(){
   let nowTimeStamp =  10* 24 * 60 * 60 * 1000;
    this.leagueService.fetchToken(nowTimeStamp).subscribe(
     data => {this.tokenGames = data;  }
    );
  }
  toggleDropdownm(gameArrayId){
    this.toggledId = gameArrayId;
    this.dropdownToggle = !this.dropdownToggle;
  }
  toggleDropdown(gameArrayId, gameArrayIndex?){
     
    if( this.toggledId.includes(gameArrayId)){
      const index = this.toggledId.indexOf(gameArrayId);
       this.toggledId.splice(index,1)
    
    this.gamesWithResults = [];
  
    }else{
      this.gamesWithResults = [];
    // this.leaguesService.tokenGamesObj.emit(this.gamesWithResults);
      this.toggledId.push(gameArrayId);
    this.active = 'active';
    }
   
  }
  enable(game){
   // console.log(game,'before');
      game.status = true;
  this.predictwinService.createGame(game,'token',game.id);
  //console.log(game ,'after');
  }
  disable (game){
  // console.log(game);
    game.status = false;
    const update =  this.predictwinService.createGame(game,'token',game.id);
  }

onPredict(gameArrayIndex,gameIndex, btn){ 
 // console.log(btn);
  const predictedGameObj = {} as gameObj;
 if (this.gamesWithResults.indexOf(this.tokenGames[gameArrayIndex].games[gameIndex])=== -1) {
   
      const game = this.tokenGames[gameArrayIndex].games[gameIndex];
      btn.marked = true;
      game.id = this.tokenGames[gameArrayIndex].id
      game['button'] = btn;
    
       this.gamesWithResults[gameIndex] = game;
      // this.filterGameResult(game,gameArrayIndex,gameIndex);

   } else {
  
    for (const game of this.gamesWithResults) {
   if(this.gamesWithResults.indexOf(game)=== gameIndex){
    btn.marked = true;
    game.button = btn;
    break;
   }
  }
    
   }
  const gamesWithResults = this.gamesWithResults.filter(value => Object.keys(value).length !== 0);
   
    predictedGameObj.id = this.tokenGames[gameArrayIndex].id;
    predictedGameObj.game =this.gamesWithResults;
    predictedGameObj.title = this.tokenGames[gameArrayIndex].title;
    this.predictedGameObj.push( predictedGameObj); 
}
  submitGameResults(){
     if(this.predictedGameObj.length >0){
      // this.predictedGameObj = this.predictedGameObj[0].game.filter(value => Object.keys(value).length !== 0);
      //console.log( this.predictedGameObj);
      if(this.submittedGamesResult.length>0){
        for(let gameResult of this.submittedGamesResult){
         
          if(this.predictedGameObj[0].id ===gameResult.id){
            for(let game of gameResult.game){
              const cleaned = this.predictedGameObj[0].game.filter(value => Object.keys(value).length !== 0);
               const duplicate = cleaned.find(gam =>{
               if(gam.home === game.home && gam.away === game.away)
                return gam;
              });
             // console.log(duplicate);
              if(duplicate ===undefined){
               // continue;
                this.predictedGameObj[0].game.push(game);
               // console.log('inside here');
              }
             
          const imela = this.predictedGameObj[0].game.filter(value => Object.keys(value).length !== 0);
           
          //  for(let i=0; i<=imela.length;i++){
          //    if(imela[i]===imela[i++]){
          //      imela.splice(i++,1);
          //    }
          //   // console.log(imela);
          //    this.predictedGameObj[0].game = imela;
          //  }
          // console.log(this.predictedGameObj);
          }
        }
        }
       
      }else{
       
      }
      this.predictedGameObj[0].game = this.predictedGameObj[0].game.filter(value => Object.keys(value).length !== 0);
       // console.log(this.predictedGameObj[0]);
    
        this.leagueService.submitGameResults( this.predictedGameObj[0],'token').then(
        data =>{this.gamesWithResults = []; this.predictedGameObj= [];}
      );
     }
   // console.log(this.gamesWithResults);
   }
  fetchSubmittedResults(){
    this.leagueService.fetchTokenGameResults().subscribe(
     results => {
      this.submittedGamesResult = results; 
     // console.log( this.submittedGamesResult);
      //this.filteredTokenGame = [];
       this.filterGameResult();
     // this.filter();
     //this.ike()
     }
    );
  }
  filterGameResult(){
    let count = 0;
   
    let array = [];
   
   let  dGame = [];
   let   elebe = [];
    let zobo = [];
    let  kai = [];
    if(this.submittedGamesResult.length>0){
    
    for(let result in this.tokenGames ){ 
      if(count<this.submittedGamesResult.length){
    const game =  this.submittedGamesResult.find(resul=>{
        if(this.tokenGames[result].id ===resul.id)
        return resul;
      });
      if(game === undefined){
       continue;
      }else {
        array[result] = game;
      }
     
     
     count++;
     
   
        if(count===this.submittedGamesResult.length)
        break;
          
    }
   
  }
   } 
   this.filtered = array;
  // console.log(this.filtered);
   let ToCount = 0;
   //  while(ToCount<8){
        /// function to grab tokenGames.games index
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
       //console.log(kai);
 // console.log( this.filteredTokenGame);
 // console.log(this.tokenGames);
  
  }
  filter(Game?){
    let gam = [];
    if(this.submittedGamesResult.length>0){
      for(let result of this.submittedGamesResult ){ 
   for(let i =0; i<=this.tokenGames.length; i++){ 
    
    if(result.id === this.tokenGames[i].id){ 
      for(let gameIndex in  this.tokenGames[i].games){ 
      for(let j in result.game){
    //for(let gameIndex in  this.tokenGames[i].games){ 
    
       if(result.game[j].id === this.tokenGames[i].id && 
       result.game[j].away ===this.tokenGames[i].games[gameIndex].away &&
       result.game[j].home ===this.tokenGames[i].games[gameIndex].home ){
          
           gam[gameIndex] =result.game[j]
        this.filteredTokenGame[i]= gam;
        // console.log(this.filteredTokenGame);
//console.log(this.submittedGamesResult);
       
        if(Game){ 
        // console.log(Game);
        if(result.game[j].id === Game.id ){ 
        this.filteredTokenGame[gameIndex].button.marked = !this.filteredTokenGame[gameIndex].button.marked
       // console.log(this.filteredFreeGame[gameIndex].button);
       // console.log(Game.button);
        break;
        }
        }
      // break;
       }
       break;
     }
    //continue;
    }
     break;
   
    }
   }
   //}
  }
   }
   //console.log(this.filteredTokenGame);
  }
  filterGameResulta(Game?,gameArrayIndex?,gamIndex?){
   // console.log(this.submittedGamesResult);
   if(this.submittedGamesResult.length>0){
    for(let gameArrayIndex in this.tokenGames){ 
    
    
      for(let resultArrayIndex in this.submittedGamesResult){ 
      
       if(this.tokenGames[gameArrayIndex].id===this.submittedGamesResult[resultArrayIndex].id){ 
        for(let gamIndex in this.tokenGames[gameArrayIndex].games){

       // let filteredArray = this.tokenGames.filter(tok => tok.id === this.submittedGamesResult[resultArrayIndex].id, gameArrayIndex );
      // if(this.filteredArray.length>0){
      //  this.filteredArray= this.filteredArray.concat(filteredArray);
      //  // console.log(this.filteredArray);
      // }else{ this.filteredArray = filteredArray}
     // console.log(this.tokenGames[gameArrayIndex]);
     for(let gameResult of this.submittedGamesResult[resultArrayIndex].game){
      
     // console.log(this.tokenGames[gameArrayIndex]);
       if(this.tokenGames[gameArrayIndex].games[gamIndex].home === gameResult.home &&
         this.tokenGames[gameArrayIndex].games[gamIndex].away === gameResult.away){ 

           const game = [];
           game[gamIndex] = gameResult;
         this.filteredTokenGame[gameArrayIndex] = game;
       
        // console.log( this.submittedGamesResult);
        // console.log( this.tokenGames);
       }
      // console.log(gameResult);
     }
    }
     
    }
    }
   }
  }
  console.log( this.submittedGamesResult);
  console.log( this.filteredTokenGame);
}
filterGameResultza(){
  let count = 0;
  console.log(this.tokenGames)
  for(let submittedGame of this.submittedGamesResult){
  for(let tokenGame of this.tokenGames){
    //for(let submittedGame of this.submittedGamesResult){
      if( tokenGame.id == submittedGame.id){
        for(let tgame in tokenGame.games){
          for(let fetched of submittedGame.game){
           // if(this.tokenGames[gameArrayIndex].games[ gameIndex])
            if( tokenGame.games[tgame].home ===fetched.home &&
              tokenGame.id ===fetched.id 
              && tokenGame.games[tgame].away ===fetched.away ){
                let gam = []
                this.filteredTokenGame[tgame]=fetched;
                console.log(this.filteredTokenGame);
            }

          }
        }
      break;
      }
    }
    count++;
    if(count === this.submittedGamesResult.length)
    break;
  }
}
filterItems(arr, query) {
  return arr.filter((el) => {
      return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  })
}
}
