import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthloginService } from '../user/authlogin.service';
import { LeaguesService } from '../predictwin/leagues.service';
import { ScorepredictionService } from './scoreprediction.service';
import { FanshopService } from '../fanshop/fanshop.service';
import { UtilityService } from '../utility.service';
export class gamesObj {
  id?: string;
  game?: object;
  length?: number;
  entry_fee: string;
  user: object;
}
@Component({
  selector: 'app-predictwithscore',
  templateUrl: './predictwithscore.component.html',
  styleUrls: ['./predictwithscore.component.scss']
})
export class PredictwithscoreComponent implements OnInit {

  user_balance = { real_amount: 0, winning_amount: 0, bonus_amount: 0, point_balance: 0, token: 0 };
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
  userCoin;
  log;
  error;
  tag;
  freeGames = [];
  predictedTokenGameObj = {} as gamesObj;
  pointsObj = { point: 0, user: {} };
  dbUserPoints;
  dbPrice = { price: 0, userId: '' }
  prizeObj = { prize: 0, userId: {} };
  tokenModalObj = { action: false, url: '' };
  freeGamesArray = [];
  arrayBuffer = [];
  // adminIds = ['1','2','3','4','5005','6','28'];
  notNoughCashTag = '';
  tokenGamepointId = [];
  submittedGamesResult = [];

  constructor(private scorePredictservice: ScorepredictionService,
    public router: Router, private utils: UtilityService,
    private service: AuthloginService, private fanshopservice: FanshopService) { }

  ngOnInit() {
    // this.onClear();
    // this.user  = this.utils.getLocalStorage('user');
    // this.session =  this.user.data.session_key;
    //  this.userId = this.user.data.user_profile.user_id;
    const user = this.utils.getLocalStorage('user');
    this.session = user.data.session_key;
    this.userId = user.data.user_profile.user_id;
    this.isLoading = true;

    this.user = { userId: this.userId, username: user.data.user_profile.user_name };
    this.pointsObj.user = user.data.user_profile;
    this.leagueForm = new FormGroup({
      'league': new FormControl(null),
    });
    let nowTimeStamp = Date.now();
    this.scorePredictservice.fetchFree('front-end', nowTimeStamp).subscribe(
      data => {
        if (data) {

          this.freeGames = [];
          this.freeGames = data;
          this.scorePredictservice.gamesEmitter.emit(data);

          this.isLoading = false;

        }
      }
    );
    this.fetchSubmittedResults();
    this.getUserBalance();

    this.scorePredictservice.freeGamesArray.subscribe(
      data => {
        this.predictedTokenGameObj = {} as gamesObj;
        this.gameNumber = 0;
        this.predictedGames = data;
        // console.log(data);
      }
    );
    //if(this.router.url ==="/predict-win/token" ){ 
    this.onClear()

    this.scorePredictservice.tokenGamesObj.subscribe(
      data => {
        this.predictedGames = data;
        if (this.predictedGames.length === 0)
          this.predictedTokenGameObj = {} as gamesObj;
      });
    this.scorePredictservice.tokenGamesArray.subscribe(
      data => {
        this.predictedTokenGameObj = {} as gamesObj;
        this.predictedTokenGameObj = data;

        this.gameNumber = (this.predictedTokenGameObj.game as Array<object>).length
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
  fetchSubmittedResults() {
    // this.scorePredictservice.getUserPredictions(this.userId,'').subscribe(
    this.scorePredictservice.getUserFreePredictionsForScoring(this.userId).subscribe(
      results => {
        this.submittedGamesResult = results;
        this.scorePredictservice.emitSubmittedGames.emit(results);
        //this.filterGameResult();
      }
    );
  }
  async getUserBalance() {

    const param = {
      user_id: this.userId
    };
    this.service
      .api("user/finance/get_user_balance", param, "POST", this.session)
      .subscribe(
        data => {
          if (data.response_code === 200) {

            this.user_balance = { real_amount: 0, winning_amount: 0, bonus_amount: 0, point_balance: 0, token: 0 };
            this.scorePredictservice.user_balanceEmitter.emit(data.data.user_balance);
            let userBalance = data.data.user_balance
            this.user_balance = data.data.user_balance;
            return true;
          } else { return false; }

        },
        error => {
          if (error['error']['global_error'] === 'Session key has expired') {
            this.error = error['error']['global_error'];
            this.tag = 'danger';
            setTimeout(() => this.router.navigate(['/']), 5000);
            // this.router.navigate(['/']);
          } else { return false }
        }
      );
    return false;
  }
  onnavigate(where) {

    if (where === "tofree") {
      this.predictedGames = [];
      this.gameNumber = 0;
      //console.log('working');
      this.leagueForm.reset();
    } else if (where === "totoken") {
      this.predictedGames = [];
      this.leagueForm.reset();
      this.predictedTokenGameObj = {} as gamesObj;
    }

  }
  fetchLeagues() {
    this.scorePredictservice.fetchAllLeagues(true).subscribe(
      leagues => this.leagues = leagues
    );
  }
  onSelectLeague() {
    let nowTimeStamp = Date.now();
    // console.log(this.leagueForm.value.league)
    const id = this.leagueForm.value.league;

    this.onClear();
    //try out this algorithm
    if (id === 'null') {
      this.scorePredictservice.fetchFree('front-end', nowTimeStamp).subscribe(data => this.scorePredictservice.freeLeagueEmitter.emit(data));
      this.scorePredictservice.fetchToken('front-end', nowTimeStamp).subscribe(data => { this.scorePredictservice.tokenLeagueEmitter.emit(data); });
    } else {
      this.scorePredictservice.fetchGame(id, 'free', 'front-end', nowTimeStamp).subscribe(data => this.scorePredictservice.freeLeagueEmitter.emit(data));
      this.scorePredictservice.fetchGame(id, 'token', 'front-end', nowTimeStamp).subscribe(data => this.scorePredictservice.tokenLeagueEmitter.emit(data));
    }


    // end of try out this algorithm
    if (this.router.url === "/predict-win/token") {
      if (id === 'null') {
        this.scorePredictservice.fetchToken('front-end', nowTimeStamp).subscribe(data => { this.scorePredictservice.gamesEmitter.emit(data); });
      } else

        this.scorePredictservice.fetchGame(id, 'token', 'front-end', nowTimeStamp).subscribe(data => this.scorePredictservice.gamesEmitter.emit(data));

    } else if (this.router.url === "/predict-win/free") {
      // console.log('free');

      if (id === 'null') {
        // console.log(id);
        this.scorePredictservice.fetchFree('front-end', nowTimeStamp).subscribe(data => this.scorePredictservice.freeEmitter.emit(data));
      } else {
        this.scorePredictservice.fetchGame(id, 'free', 'front-end', nowTimeStamp).subscribe(data => this.scorePredictservice.gamesEmitter.emit(data));
      }

    }
    // console.log(id);
  }
  closeAlert() {
    if (this.notNoughCashTag === 'No cash') {
      this.error = null;

      // show the buy token modal
      this.tokenModalObj.action = true;
      this.fanshopservice.getTokenSubject.next(this.tokenModalObj);

    }
    else if (this.error === 'token added successfully' && this.tag === 'success') {

      this.router.navigate(['/predict-win/token']);
    } else {
      this.error = null;
    }

  }
  hasEnoughToken(game) {
    const entry_fee = +game.entry_fee
    if (typeof entry_fee === 'number') {
      if (this.user_balance.token >= entry_fee) {
        return true;
      } else {

        return false;
      }
    } else
      return false;
  }
  async submitPrediction() {
    let userBalance = {};
    // await this.getUserBalance();
    if (this.router.url === '/predict-win/free') {
      this.isLoading = true;
      if (this.predictedGames.length > 0) {
        let count = 0;
        for (let game of this.predictedGames) {
          this.scorePredictservice.checkForGameIdAndPlayerId(game.ID, this.userId).subscribe(
            data => {
              if (data.length === 0) {
                this.scorePredictservice.createForAdmin(game);
                count++
                if (count === this.predictedGames.length) {
                  //console.log('finished')
                  this.predictedGames = [];
                  this.isLoading = false;
                  this.error = 'Your prediction is submitted successfully'; this.tag = 'success';
                }

              } else {
                //this.scorePredictservice.createForAdmin(game);
                //this.scorePredictservice.createForAdmin(game).then(data=>console.log('done'));
                // this.scorePredictservice.createForAdmin(game);
                //this.error = 'You are not allowed to make more than one prediction per game'; this.tag ='danger';
              }
            }
          );
          //this.scorePredictservice.createMyPredictions(game, this.userId);
        }

      }

    } else if (this.router.url === '/predict-win/token') {

      if (this.predictedTokenGameObj) {
        this.notNoughCashTag = '';
        const entry_fee = +this.predictedTokenGameObj.entry_fee;
        //console.log(this.user_balance)
        if (this.getUserBalance()) {
          if (this.user_balance.token >= entry_fee) {
            if (this.deductEntryFee()) {
              this.predictedTokenGameObj.user = this.user;
              // this.scorePredictservice.createMyPredictions(this.predictedTokenGameObj, this.userId, 'token').then(
              this.scorePredictservice.createForAdmin(this.predictedTokenGameObj).then(
                // do something
                done => {
                  this.predictedGames = [];
                  this.predictedTokenGameObj = {} as gamesObj
                  this.error = 'Your token prediction was submitted successfully'; this.tag = 'success';
                })

            } else { this.tag = 'danger'; this.error = 'Something went wrong, your prediction was not submitted!'; }

          } else {
            this.tag = 'danger';
            this.notNoughCashTag = 'No cash';
            this.error = `You only have ${this.user_balance.token} token, but you need ${entry_fee} token to predict this game, please get more token to continue!!`;
          }
        }
      }
    }
  }

  deductEntryFee() {

    const entry_fee = +this.predictedTokenGameObj.entry_fee
    if (entry_fee) {
      this.user_balance.token -= entry_fee;

      if (this.updateUserBalance(this.user_balance.token)) {
        // console.log(this.user_balance.token)
        return true;
      } else {
        this.user_balance.token += +entry_fee;

        return false;
      }

    }

  }
  async updateUserBalance(userToken) {
    //console.log(userToken);
    const param = {
      point_bal: 0,
      real_bal: 0,
      winning_bal: 0,
      bonus_bal: 0,
      token: 0,
      user_id: this.userId
    };
    if (userToken >= 0) {
      // console.log(userToken)
      param.point_bal = this.user_balance.point_balance
      param.bonus_bal = this.user_balance.bonus_amount;
      param.real_bal = this.user_balance.real_amount;
      param.winning_bal = this.user_balance.winning_amount;
      param.token = userToken;//this.user_balance.token;
      await this.service
        .api("user/finance/updateUserBalanceFromFANSHOP", param, "POST", this.session)
        .subscribe(
          data => {
            if (data.response_code === 200) {

              this.user_balance.bonus_amount = +data.data.bonus_amount;
              this.user_balance.point_balance = +data.data.point_balance;
              this.user_balance.real_amount = +data.data.real_amount;
              this.user_balance.token = +data.data.token;
              this.user_balance.winning_amount = +data.data.winning_amount;
              this.scorePredictservice.user_balanceEmitter.emit(this.user_balance);


              return true;
            }
            //this.user_balance = data.data.user_balance;

          },
          error => {
            console.log(error)
            if (error['error']['global_error'] === 'Session key has expired') {
              this.error = error['error']['global_error'];
              this.tag = 'danger';
              setTimeout(() => this.router.navigate(['/']), 5000);
              // this.router.navigate(['/']);
            }
            return false;
          });
    } else
      return false;
  }
  onClear() {
    // console.log(this.router.url);
    if (this.router.url === '/predict-win/free') {
      this.predictedGames = [];
      this.gameNumber = 0;
      this.scorePredictservice.clearGamesArray.emit('freeGames');

    }
    else if (this.router.url === '/predict-win/token') {
      this.predictedGames = [];
      this.predictedTokenGameObj = {} as gamesObj;

      this.scorePredictservice.clearGamesArray.emit('tokenGames');
    }

  }


  getFreeGamesResults() {
    this.scorePredictservice.fetchFreeGameResults().subscribe(
      data => this.freeGamesResults = data
    )
  }
  getTokenGamesResults() {
    this.scorePredictservice.fetchTokenGameResults().subscribe(
      data => { this.tokenGamesResults = data; }
    )
  }
}
