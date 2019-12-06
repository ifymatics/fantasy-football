import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaguesService } from '../leagues.service';
import { PredictwinService } from '../predictwin.service';
import { UtilityService } from 'src/app/utility.service';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { switchMap } from 'rxjs/Operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FanshopService } from 'src/app/fanshop/fanshop.service';


export class gamesObj {
  id?:string;
  game?: object;
  length?:number;
  entry_fee: string;
  user: object;
}
export class PointObj {
 point: number;
 user: object;
}
@Component({
  selector: 'app-predictwin',
  templateUrl: './predictwin.component.html',
  styleUrls: ['./predictwin.component.scss']
})
export class PredictwinComponent implements OnInit {
  user_balance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0, token: 0};
  predictwin;
  leagueForm: FormGroup;
  leagues = [];
  tokenGames = [];
  isLoading;
  predictedGames = [];
  userFreePredictions = [];
  userTokenPredictions = [];
  freeGamesResults = [];
  tokenGamesResults = [];
  gameNumber = 0;
  user;
  session;
  userId;
  point = 0;
  price = 0;
  userCoin ;
  log;
  error;
  tag;
  freeGames = [];
  predictedTokenGameObj = {} as gamesObj;
  pointsObj = {point:0,user:{}};
  dbUserPoints;
  dbPrice = {price: 0, userId:''}
  prizeObj = {prize: 0,userId: {}};
  tokenModalObj = {action: false, url: ''};
  freeGamesArray = [];
  arrayBuffer = [];
 // adminIds = ['1','2','3','4','5005','6','28'];
  notNoughCashTag = '';
  tokenGamepointId = [];
  submittedGamesResult = [];
  
  constructor(private leaguesService: LeaguesService,
    private predictwinService: PredictwinService,
    public router: Router, private utils: UtilityService,
    private service: AuthloginService,private fanshopservice: FanshopService) { }

  ngOnInit() {
   // this.onClear();
    // this.user  = this.utils.getLocalStorage('user');
    // this.session =  this.user.data.session_key;
    //  this.userId = this.user.data.user_profile.user_id;
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
   this.isLoading = true;
  
    this.user = {userId: this.userId, username:user.data.user_profile.user_name};
     this.pointsObj.user= user.data.user_profile;
    this.leagueForm = new FormGroup({
      'league':   new FormControl(null),
    });
    let nowTimeStamp = Date.now();
    this.leaguesService.fetchFree('front-end', nowTimeStamp).subscribe(
      data => {
        if(data){
         
          this.freeGames = [];
          this.freeGames = data;
          this.predictwinService.gamesEmitter.emit(data);
        
          this.isLoading = false;
         
        }
      }
    );
    this.fetchSubmittedResults();
     this.getUserBalance();
    
      this.leaguesService.freeGamesArray.subscribe(
        data => { 
          this.predictedTokenGameObj = {} as gamesObj;
          this.gameNumber = 0;
           this.predictedGames = data;
       // console.log(data);
        }
       );
      //if(this.router.url ==="/predict-win/token" ){ 
        this.onClear()
      
      this.leaguesService.tokenGamesObj.subscribe(
        data => {  
          this.predictedGames = data;
          if(this.predictedGames.length===0)
          this.predictedTokenGameObj = {} as gamesObj;
        } );
      this.leaguesService.tokenGamesArray.subscribe(
        data => { 
          this.predictedTokenGameObj = {} as gamesObj;
           this.predictedTokenGameObj = data;
     
       this.gameNumber =(this.predictedTokenGameObj.game as Array<object>).length
        }
       );
     //}
    
    
    this.predictwin = this.router.isActive('/predict-win', true);
    this.fetchLeagues(); 
    this.getFreeGamesResults();
  // this.getUserFreePredictions();
   this.getTokenGamesResults();
   //this.getUserTokenPredictions();
  
  }
  fetchSubmittedResults(){
   // this.leaguesService.getUserPredictions(this.userId,'').subscribe(
    this.leaguesService.getUserFreePredictionsForScoring(this.userId).subscribe(
     results => {   this.submittedGamesResult = results;
      this.leaguesService.emitSubmittedGames.emit(results);
      //this.filterGameResult();
     }
    );
  }
  async getUserBalance () {
   
    const param = {
      user_id: this.userId
    };
     this.service
    .api("user/finance/get_user_balance", param, "POST", this.session)
    .subscribe(
      data => {
       if(data.response_code===200){
        
         this.user_balance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0, token: 0};
         this.leaguesService.user_balanceEmitter.emit(data.data.user_balance);
        let  userBalance = data.data.user_balance
         this.user_balance = data.data.user_balance;
         return true;
      }else{return false;}
      
      },
      error=>{
        if (error['error']['global_error'] === 'Session key has expired') {
        this.error = error['error']['global_error'];
        this.tag = 'danger';
        setTimeout(() =>  this.router.navigate(['/']) , 5000);
       // this.router.navigate(['/']);
      }else{ return false}
    }
    );
   return false;
  }
 onnavigate(where){
 
 if(where ==="tofree"){
  this.predictedGames = [];
      this.gameNumber =0;
  //console.log('working');
  this.leagueForm.reset();
 }else if(where ==="totoken"){
  this.predictedGames = [];
  this.leagueForm.reset();
      this.predictedTokenGameObj = {} as gamesObj;
 }

  }
  fetchLeagues() {
    this.leaguesService.fetchAllLeagues(true).subscribe(
      leagues => this.leagues = leagues
    );
  }
  onSelectLeague(){
    let nowTimeStamp = Date.now();
   // console.log(this.leagueForm.value.league)
    const id = this.leagueForm.value.league;

    this.onClear();
    //try out this algorithm
    if(id === 'null'){
      this.leaguesService.fetchFree('front-end',  nowTimeStamp).subscribe( data => this.leaguesService.freeLeagueEmitter.emit(data) );
       this.leaguesService.fetchToken('front-end',  nowTimeStamp).subscribe(data=>{this.leaguesService.tokenLeagueEmitter.emit(data);});
  }else{
    this.predictwinService.fetchGame(id,'free','front-end', nowTimeStamp).subscribe( data =>  this.leaguesService.freeLeagueEmitter.emit(data) );
    this.predictwinService.fetchGame(id,'token', 'front-end', nowTimeStamp).subscribe( data => this.leaguesService.tokenLeagueEmitter.emit(data) );
  }
 
 
    // end of try out this algorithm
    if (this.router.url === "/predict-win/token") {
       if(id === 'null'){ this.leaguesService.fetchToken('front-end', nowTimeStamp ).subscribe(data=>{this.predictwinService.gamesEmitter.emit(data);});
      }else
     
      this.predictwinService.fetchGame(id,'token', 'front-end', nowTimeStamp).subscribe( data => this.predictwinService.gamesEmitter.emit(data) );

    } else if(this.router.url === "/predict-win/free"){ 
     // console.log('free');
    
     if(id=== 'null'){
     // console.log(id);
     this.leaguesService.fetchFree('front-end',  nowTimeStamp).subscribe( data =>  this.predictwinService.freeEmitter.emit(data) );
     }else{
      this.predictwinService.fetchGame(id,'free','front-end', nowTimeStamp).subscribe( data =>  this.predictwinService.gamesEmitter.emit(data) );
     }
   
    }
   // console.log(id);
  } 
  closeAlert() {
    if( this.notNoughCashTag === 'No cash' ){
      this.error = null;
    
       // show the buy token modal
       this.tokenModalObj.action = true;
       this.fanshopservice.getTokenSubject.next(this.tokenModalObj);

    }
    else if(this.error ==='token added successfully' && this.tag ==='success'){
     
this.router.navigate(['/predict-win/token']);
    }else{
      this.error = null;
    }
   
    }
    hasEnoughToken(game){
      const entry_fee = +game.entry_fee
      if(typeof entry_fee ==='number'){ 
      if(this.user_balance.token>= entry_fee){
        return true;
      }else{
        
        return false;
      }
     }else 
      return false;
     }
 async submitPrediction(){
   let userBalance = {};
   // await this.getUserBalance();
    if(this.router.url === '/predict-win/free'){
      this.isLoading = true;
      if(this.predictedGames.length>0) {
        let count = 0;
        for(let game of this.predictedGames ) { 
          this.leaguesService.checkForGameIdAndPlayerId(game.ID, this.userId).subscribe(
            data=>{
              if(data.length === 0){
                  this.leaguesService.createForAdmin(game);
                  count++
                if(count === this.predictedGames.length) {
                  //console.log('finished')
                  this.predictedGames = [];
                  this.isLoading = false;
                  this.error = 'Your prediction is submitted successfully'; this.tag ='success';
                }
                
            }else{
              //this.leaguesService.createForAdmin(game);
              //this.leaguesService.createForAdmin(game).then(data=>console.log('done'));
             // this.leaguesService.createForAdmin(game);
              //this.error = 'You are not allowed to make more than one prediction per game'; this.tag ='danger';
           }
          }
          );
           //this.leaguesService.createMyPredictions(game, this.userId);
       }
       
      }
     
    } else if(this.router.url === '/predict-win/token'){
     
      if(this.predictedTokenGameObj){ 
        this.notNoughCashTag = '';
        const entry_fee = +this.predictedTokenGameObj.entry_fee;
        //console.log(this.user_balance)
       if(this.getUserBalance()){
        if(this.user_balance.token>= entry_fee){ 
        if(this.deductEntryFee()){
          this.predictedTokenGameObj.user= this.user; 
         // this.leaguesService.createMyPredictions(this.predictedTokenGameObj, this.userId, 'token').then(
          this.leaguesService.createForAdmin(this.predictedTokenGameObj).then( 
            // do something
            done => { this.predictedGames = [];  
              this.predictedTokenGameObj = {} as gamesObj
              this.error = 'Your token prediction was submitted successfully'; this.tag ='success';
            })
            
        }else {this.tag =  'danger'; this.error ='Something went wrong, your prediction was not submitted!';}
     
      }else{
        this.tag = 'danger';
        this.notNoughCashTag = 'No cash';
        this.error = `You only have ${this.user_balance.token} token, but you need ${entry_fee} token to predict this game, please get more token to continue!!` ;
      }
    }
     }
    }
  }
  
  deductEntryFee(){
 
   const entry_fee = +this.predictedTokenGameObj.entry_fee
   if(entry_fee){
     this.user_balance.token -= entry_fee;
   
     if(this.updateUserBalance(this.user_balance.token)){
      // console.log(this.user_balance.token)
       return true;
     }else{
      this.user_balance.token += +entry_fee;
    
      return false;
     }
    
   }
 
  }
 async updateUserBalance(userToken){
    //console.log(userToken);
    const param = {
      point_bal: 0,
      real_bal:0,
      winning_bal:0,
      bonus_bal: 0,
      token: 0,
      user_id: this.userId
    };
    if(userToken>=0){
     // console.log(userToken)
      param.point_bal = this.user_balance.point_balance
      param.bonus_bal = this.user_balance.bonus_amount;
      param.real_bal = this.user_balance.real_amount;
      param.winning_bal = this.user_balance.winning_amount;
      param.token = userToken ;//this.user_balance.token;
    await this.service
    .api("user/finance/updateUserBalanceFromFANSHOP" , param, "POST", this.session)
    .subscribe(
      data => {
        if(data.response_code===200){ 
          
             this.user_balance.bonus_amount = +data.data.bonus_amount;
          this.user_balance.point_balance = +data.data.point_balance;
          this.user_balance.real_amount = +data.data.real_amount ;
          this.user_balance.token = +data.data.token;
          this.user_balance.winning_amount = +data.data.winning_amount;
           this.leaguesService.user_balanceEmitter.emit(this.user_balance);
         
          
           return true;
          }
       //this.user_balance = data.data.user_balance;
  
      },
      error=>{
        console.log(error)
        if (error['error']['global_error'] === 'Session key has expired') {
          this.error = error['error']['global_error'];
          this.tag = 'danger';
          setTimeout(() =>  this.router.navigate(['/']) , 5000);
        // this.router.navigate(['/']);
        }
        return false;
      } );
    }else
    return false;
  }
  onClear(){
    // console.log(this.router.url);
    if (this.router.url === '/predict-win/free'){ 
      this.predictedGames = [];
      this.gameNumber =0;
    this.leaguesService.clearGamesArray.emit('freeGames');
  
    }
    else if (this.router.url === '/predict-win/token'){ 
      this.predictedGames = [];
      this.predictedTokenGameObj = {} as gamesObj;
  
    this.leaguesService.clearGamesArray.emit('tokenGames');
    }

  }
  
 
  getFreeGamesResults(){
    this.leaguesService.fetchFreeGameResults().subscribe(
      data => this.freeGamesResults = data
    )
  }
  getTokenGamesResults(){
    this.leaguesService.fetchTokenGameResults().subscribe(
      data => {this.tokenGamesResults = data; }
    )
  }
  
  scoreFreePredictedGames(){
  
    let point = 0;
    let coin = 0;
    this.userCoin = 0;
    
    if(this.freeGamesResults.length>0){
     
      if(this.userFreePredictions.length>0){
        setTimeout(()=>{
         
        }, 10000);
        this.freePredictedGamesScoreMerger(point,coin);
       //console.log('chai i am here')
      }
    }
    this.updatePredictedGamesAfterScoring(this.freeGamesArray);
 // this.updateUserBalance(this.userCoin);
  //this.point = point;
 
   //console.log(this.point);
  }
   freePredictedGamesScoreMerger(point,coin){
    // console.log('inside merger');
    for(let gameResult of this.freeGamesResults){
      //  console.log( this.freeGamesResults);
        for(let userGame in this.userFreePredictions){
        //console.log(userGame);
         if(this.userFreePredictions[userGame].id ===  gameResult.id){
            if(this.userFreePredictions[userGame].scored === false){
              if(this.userFreePredictions[userGame].button.name === gameResult.button.name && 
                this.userFreePredictions[userGame].home === gameResult.home && this.userFreePredictions[userGame].away === gameResult.away &&
                this.userFreePredictions[userGame].button.marked === gameResult.button.marked
              ){
                this.userFreePredictions[userGame].result = true;
                this.userFreePredictions[userGame].scored = true;
                //Now the user predicted correctly, award 1 point and credit the prize too
                point++;
                  coin += +this.userFreePredictions[userGame].prize; 
               this.userCoin = coin;
               this.userFreePredictions[userGame]['points'] = 1;
             // console.log(point);
             this.freeGamesArray[userGame] = this.userFreePredictions[userGame];
             
             }else{ 
              this.userFreePredictions[userGame].scored = true; 
              this.freeGamesArray[userGame] = this.userFreePredictions[userGame];
              }
             
             
           }else{ continue}
         
          //this.updatePredictedGamesAfterScoring(userGame);
         }
        // else{continue;}
       
        }
      }
   }
  scoreTokenPredictedGames(){
    let point = 0;
    let coin = 0;
    let gameCount =0;
    let gameArray = [];
    this.userCoin =0;
    let prize = '';
    if(this.tokenGamesResults.length>0){
     
      if(this.userTokenPredictions.length>0){
      
       for(let gameResult of this.tokenGamesResults){
       
         for(let userGame in this.userTokenPredictions){
          gameCount = 0;
          if(this.userTokenPredictions[userGame].id ===  gameResult.id){
            
            for(let gResult  of gameResult.game){
             
            for(let userG in this.userTokenPredictions[userGame].game){
              if(!this.userTokenPredictions[userGame].game[userG].scored){
             if(this.userTokenPredictions[userGame].game[userG].away === gResult.away
               && this.userTokenPredictions[userGame].game[userG].home ===gResult.home){
             
              if(this.userTokenPredictions[userGame].game[userG].button.name === gResult.button.name && 
                this.userTokenPredictions[userGame].game[userG].button.marked === gResult.button.marked
                ){
                // console.log(userG);
                this.userTokenPredictions[userGame].game[userG].result = true;
                  //Now the user predicted correctly, award 1 point and credit the prize too
                  gameCount++;
                 point = point+2;
                 //this.pointsObj.point = point;
                 this.userCoin = coin;
                 this.userTokenPredictions[userGame].game[userG]['points'] = 2;
                 
                 if(!this.arrayBuffer.includes(this.userTokenPredictions[userGame].game[userG])){
                  this.arrayBuffer.push( this.userTokenPredictions[userGame].game[userG]);
                 // this.updateUserPoints(2);
                 // console.log(this.arrayBuffer);
                 }
               
                 
                 if( this.userTokenPredictions[userGame].result_count){
                  this.userTokenPredictions[userGame].result_count++
                 }else{
                  this.userTokenPredictions[userGame]['result_count'] = gameCount;
                 }
               
                 //console.log(gameCount)
               } else{  }
               this.userTokenPredictions[userGame].game[userG].scored = true;
               gameArray[userGame] = this.userTokenPredictions[userGame];
             }else{  continue;}
            }
            // console.log(this.userTokenPredictions[userGame].game[userG]);

             }
            }
           
           // }
          }
         // else{continue;}
        
         }
        
       }
      
     
      }
    }
  //this.updateUserBalance(this.userCoin);
  
   //point>0?this.updateUserPoints(point): '';
   this.updatePredictedTokenGamesAfterScoring(gameArray);
  }
  updatePredictedTokenGamesAfterScoring(predictedTokenGamesArray){
   predictedTokenGamesArray.forEach(gamesCluster => {
     if(gamesCluster.length === gamesCluster.result_count){
       this.userCoin += +gamesCluster.prize;
       //this.updateUserPoints(this.pointsObj);
     }
     
    this.leaguesService.createMyPredictions(gamesCluster, this.userId, 'token');
   });
   // call userCoin updater Function here
   //this.updateCoin(this.userCoin);
  
  }
  updateUserPoints(points){
    //console.log(points);
    if(this.pointsObj.point>0){
      //console.log(this.pointsObj.point)
      this.pointsObj.point +=  points;
    }else{
      this.pointsObj.point =  points;
    }
   
  
      // this.leaguesService.updateUserPoint(this.userId, this.pointsObj).then(data=> { 
      //   this.pointsObj.point = 0;
      //  this.leaguesService.getMyPoints(this.userId).subscribe(data=>this.pointsObj.point= +data);}
      //  );
  
     
  }

  updatePredictedGamesAfterScoring(userPredictions){
    this.price=0;
    this.point =0;
   // console.log(userPredictions);
    if(userPredictions.length>0){ 
    userPredictions.forEach(element => {
      if(element.result === true){
        if(this.arrayBuffer.includes(element.id)){
          this.pointsObj.point += +element.point;
        //this.updateUserPoints(this.pointsObj);
       this.price += +element.prize;
       this.point += +element.points;
        }
       
      
      }
      this.leaguesService.updateUserpredictionsAfterScoring(this.userId,element);
    });
   
    //this.updateUserPoints( this.pointsObj)
  //this.point>0? this.updateUserPoints(this.point): '';
  //this.updateCoin(this.price);
    //console.log(this.point);
  }
  }
  updateCoin(coin){
    let response = '';
    this.dbPrice['userId'] = this.userId;
    if(coin){ 
      this.dbPrice['price']>0?this.dbPrice['price'] += +coin:this.dbPrice['price']= +coin;
      //if(this.dbPrice){this.dbPrice.price +=coin;}else{ this.dbPrice['price'] += coin;}
      // this.leaguesService.updatePrize(this.userId,this.dbPrice).then(data=>response='submitted');
       //this.updateUserBalance(coin);
    }
    if(response === 'submitted')this.leaguesService.getPrize(this.userId).subscribe(data=>{this.log=data;
      if(this.log)this.dbPrice = this.log;
      });
  }
 
}
