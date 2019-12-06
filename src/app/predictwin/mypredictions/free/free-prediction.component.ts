import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/utility.service';
import { LeaguesService } from '../../leagues.service';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/Operators';
export class Game{
ID:string;
scored: boolean;
}
@Component({
  selector: 'app-free-prediction',
  templateUrl: './free-prediction.component.html',
  styleUrls: ['./free-prediction.component.scss']
})
export class FreePredictionComponent implements OnInit {
user;
session;
userId;
userFreePredictions = [];
isLoading = false;
pointSum = 0;
pointObj = {point: 0,user: {}};
userTokenPredictions = [];
tokenSum = 0;
tokenAnalyser = [];
tokenPrizeSum = 0;
dbPoint;
freeGameAwarded = [];
date?;
domPrice = 0;
isDuplicate = [];
user_balance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0, token: 0};
prizeObj = {prize: 0, user: {}}
  constructor(private utils: UtilityService,
     private leaguesService: LeaguesService, private service: AuthloginService,
     private db: AngularFirestore ) { }

  ngOnInit() {
    this.domPrice = 1;
   //console.log(this.date)
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.isLoading = true;
     
    this.pointObj.user = user.data.user_profile;
    this.pointObj.point = 0;
    this.leaguesService.getMyPoints(this.userId).subscribe(data=>{
      this.dbPoint = data;
      if(this.dbPoint){this.pointObj.point= this.dbPoint.point; }
   });
     this. getUserBalance ();
    this.getAllTokenPredictions();
    this.getAllFreePredictions();
    //this.calculatePoints();
  }
   getAllFreePredictions(){
 
  //  this.leaguesService.getUserPredictions(this.userId, '').pipe(first()).subscribe(
  //   data => { this.userFreePredictions = data;   this.rearrangeResponse(data);}
  // );
  
  this.leaguesService.getUserFreePredictionsForScoring(this.userId)
.subscribe((data)=>{
//  for(let game of data){
//   let index =this.isDuplicate.indexOf(game.ID);
//   if(index === -1){ 
//     this.userFreePredictions.push(game);
//        this.isDuplicate.push(game.ID);
  
//   }else{
//     if(game.scored){
//       let gameArray = this.userFreePredictions.filter(data=>data.scored !==game.scored && data.ID === game.ID);
    
//       let index =this.userFreePredictions.indexOf(gameArray[0]);
//       if(index !== -1){
//         this.userFreePredictions.splice(index,1);
//         this.userFreePredictions.push(game);
//       }
//      // this.userFreePredictions.push(game)
//       //this.isDuplicate[index] = game.ID
//     }
//   }
//   // if(!game.scored && this.isDuplicate.includes(game.ID)){
//   //    let index =this.isDuplicate.indexOf(game.ID);
//   //    this.isDuplicate.splice(index,1);
//   //    this.userFreePredictions.push(game);
//   //   // console.log(game)
//   //  }
//  }
 this.userFreePredictions=data;
})
 }


 async rearrangeResponse(data){
  let afterCalcPoint = await this.calculatePoints(data);
  if(afterCalcPoint) if(afterCalcPoint.length>0)
   this.submitGames(afterCalcPoint);
 }

async  calculatePoints(freeGames){
  //console.log(this.userFreePredictions)
  //this.pointObj.point = 0;
 let codeToken = await this.analyseTokenGames();
 let codeFree = await this.analyseFreeGames(freeGames);
 if(!codeFree)codeFree = [];
  //this.pointObj.point = this.tokenSum+this.pointSum;
 //console.log(this.pointObj.point)
 if(codeFree || codeToken){ 
   if(codeFree.length>0 ||  codeToken)
  if(this.pointSum>0 || this.tokenSum>0){ 
    this.pointObj.point>0?this.pointObj.point += this.tokenSum+this.pointSum: 
    this.pointObj.point = this.tokenSum+this.pointSum;
   
    this.prizeObj.prize>0 ? this.prizeObj.prize += this.pointSum + this.tokenPrizeSum:
    this.prizeObj.prize = this.pointSum + this.tokenPrizeSum ;
    // console.log(this.prizeObj)
     this.leaguesService.updateUserPoint(this.userId, this.pointObj);
     this.leaguesService.updatePrize(this.userId,  this.prizeObj);
  this.updateUserBalance(this.prizeObj.prize);
  return codeFree;
  }
}
} 
submitGames(afterCalcPoint){
 // console.log(afterCalcPoint)
  if(afterCalcPoint){
    if(afterCalcPoint.length>0)
  afterCalcPoint.forEach(game=>this.leaguesService.updateGame(this.userId,game))
  }
}
analyseFreeGames(userFreePredictions){
  let games = [];
  if(userFreePredictions.length>0){
    for(let free in userFreePredictions){
      if(userFreePredictions[free].result &&  !userFreePredictions[free]['has_awarded_point'] ){
        this.pointSum += +userFreePredictions[free].points;
        userFreePredictions[free]['has_awarded_point'] = true;
       
         games.push( userFreePredictions[free])
       }
     else continue;
   }
 if(games.length>0)return games;else return games=[];
  }
}
analyseTokenGames(){
  if(this.userTokenPredictions.length>0){
   
    for(let tokenGame of this.userTokenPredictions){
       for(let token in tokenGame.game){
          if(tokenGame.game[token].result && !tokenGame.game[token]['has_awarded_point']){
            this.tokenSum += +tokenGame.game[token].points; 
            //console.log(this.tokenSum);
            tokenGame.game[token]['has_awarded_point'] = true;
            //this.leaguesService.createMyPredictions(tokenGame, this.userId, 'token').then(data=>console.log('token done'));
          }
         else continue;
       }
       if(tokenGame.result_count===tokenGame.game.length &&   !tokenGame['has_awarded_cluster_prize']){
        this.tokenPrizeSum += +tokenGame.prize;
        tokenGame['has_awarded_cluster_prize'] = true;
        //console.log(this.tokenPrizeSum)
        //call a function to update the token game

       }
       this.leaguesService.createMyPredictions(tokenGame, this.userId, 'token').then(data=>console.log('token done'));
    }
 
   return true;
  }
  return false;
}
updateUserPoints(points){
  //console.log(points);
  if(this.pointObj.point>0){
    //console.log(this.pointsObj.point)
    this.pointObj.point +=  points;
  }else{
    this.pointObj.point =  points;
  }
 

    this.leaguesService.updateUserPoint(this.userId, this.pointObj).then(data=> { 
      this.pointObj.point = 0;
     this.leaguesService.getMyPoints(this.userId).subscribe(data=>this.pointObj.point= +data);}
     );

   
}

getAllTokenPredictions(){
  this.leaguesService.getUserTokenPredictionsForScoring(this.userId).subscribe(data=>this.userTokenPredictions = data)
  // this.leaguesService.getUserPredictions(this.userId, '', 'token').subscribe(
  //   data =>  {this.userTokenPredictions = data; }
  // );
 }
 getUserBalance () {
  const param = {
    user_id: this.userId
  };
  this.service
  .api("user/finance/get_user_balance", param, "POST", this.session)
  .subscribe(
    data => {
     if(data.response_code===200)this.user_balance = data.data.user_balance
    
    },
    error=>console.log(error)
  );

}
updateUserBalance(userCoin){
  //console.log(userCoin);
  const param = {
    point_bal: 0,
    real_bal:0,
    winning_bal:0,
    bonus_bal: 0,
    token: 0,
    user_id: this.userId
  };
  if(userCoin>0){
    param.point_bal = +this.user_balance.point_balance
    param.point_bal += +userCoin;
    param.bonus_bal = this.user_balance.bonus_amount;
    param.real_bal = this.user_balance.real_amount;
    param.winning_bal = this.user_balance.winning_amount;
    param.token = this.user_balance.token;
    this.service
  .api("user/finance/updateUserBalanceFromFANSHOP" , param, "POST", this.session)
  .subscribe(
    data => {
      if(data.response_code===200){ this.user_balance = data.data.user_balance;}
     //this.user_balance = data.data.user_balance;
   
     //console.log(data);
    }, error=>{
      
    }
  );
  }
}
 
}
