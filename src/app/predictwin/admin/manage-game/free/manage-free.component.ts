import { Component, OnInit } from '@angular/core';
import { LeaguesService } from 'src/app/predictwin/leagues.service';
import { PredictwinService } from 'src/app/predictwin/predictwin.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-manage-free',
  templateUrl: './manage-free.component.html',
  styleUrls: ['./manage-free.component.scss']
})
export class ManageTeamFreeComponent implements OnInit {
 freeGames$;
 freeGames = [];
 leagues  = [];
 isLoading;
 gamesWithResults = [];
 submittedGamesResult = [];
 filteredFreeGame = [];
 buttons = [{name:'Home',  marked: false},{name:'Draw',  marked: false},{name:'Away',  marked: false}];
 resultButtons = [];
 session;
  userId;
  adminIds = ['1','2','3','4','443','6','28'];
  constructor(private predictwinService: PredictwinService,
    private leagueService: LeaguesService,private router:Router,
    private db: AngularFirestore,  private utils: UtilityService ) { }

  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    // if(!this.adminIds.includes(this.userId)){  this.router.navigate(['/home']);}
    // setTimeout(() =>this.styleResult(),5000);
    this.isLoading = true;
  let nowTimeStamp = Date.now();
   nowTimeStamp =  5* 24 * 60 * 60 * 1000
   //console.log(nowTimeStamp)
    this.leagueService.fetchFree('',nowTimeStamp).subscribe(
      data => { this.freeGames = data; }
     );
     this.predictwinService.gamesEmitter.subscribe(
       data => {
         if(data){
           this.freeGames = [];
           this.freeGames = data;
          
         }
       }
     );
     this.fetchSubmittedResults();
       
    // this.fetchAllFreeGames();
    
  }
  enable(game){
    //console.log(game,'before');
     game.status = true;
  const update =  this.predictwinService.createGame(game,'',game.id);
 // console.log(game ,'after');
  }
  disable (game){
   //console.log(game);
   game.status = false;
   const update =  this.predictwinService.createGame(game,'',game.id);
  }
 
  onSelectResult(gameIndex, index, btn){ 
  
    // console.log(btn, gameIndex);
   let gamesWithResults = [];
    if (this.gamesWithResults.indexOf(this.freeGames[gameIndex])=== -1) {
        const game = this.freeGames[gameIndex];
        btn.marked = true;
        game.datePredicted = Date.now();
         game['button'] = btn;
         this.filterGameResult(game);
         this.gamesWithResults[gameIndex] = game;

    } else {
    
      for (const game of this.gamesWithResults) {
     if(this.gamesWithResults.indexOf(game)=== gameIndex){
      btn.marked = true;
      game.button = btn;
      break;
     }
    }
      
    }
    // this.gamesWithResults = this.gamesWithResults.filter(value => Object.keys(value).length !== 0);
   // console.log(this.gamesWithResults);

  }
  submitGameResults(){
   if(this.gamesWithResults.length >0){
     this.gamesWithResults.forEach(game => {this.leagueService.submitGameResults(game).then(
       data =>this.gamesWithResults = []
     );

    });
   }
  }
  fetchSubmittedResults(){
    this.leagueService.fetchFreeGameResults().subscribe(
     results => { this.submittedGamesResult = results; 
      this.filterGameResult();
     }
    );
  }
  filterGameResult(Game?){
    
    for(let gameIndex in this.freeGames)
    if(this.submittedGamesResult.length>0){
     for(let game of this.submittedGamesResult){
       if(game.id===this.freeGames[gameIndex].id){
        this.filteredFreeGame[gameIndex]= game;
        if(Game){ 
         // console.log(Game);
        if(game.id === Game.id ){ 
        this.filteredFreeGame[gameIndex].button.marked = !this.filteredFreeGame[gameIndex].button.marked
       // console.log(this.filteredFreeGame[gameIndex].button);
       // console.log(Game.button);
        break;
        }
        }
        //this.filteredFreeGame[gameIndex];
       
       }
      
     }
    }
  }
}
