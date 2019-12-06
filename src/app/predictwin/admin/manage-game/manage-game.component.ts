import { Component, OnInit } from '@angular/core';
import { LeaguesService } from '../../leagues.service';
import { PredictwinService } from '../../predictwin.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter, first } from 'rxjs/Operators';
import { UtilityService } from 'src/app/utility.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PointObj } from '../../predictwin/predictwin.component';
import { AuthloginService } from 'src/app/user/authlogin.service';

@Component({
  selector: 'app-manage-game',
  templateUrl: './manage-game.component.html',
  styleUrls: ['./manage-game.component.scss']
})
export class ManageGameComponent implements OnInit {
  leagues = [];
  tokenGames = [];
  freeGames = [];
  type = 'free';
  freeGamesResults = [];
  tokenGamesResults = [];
  userPredictions = [];
  isDuplicate = [];
  GamesArray = [];
  userRewardArray = [];
  userCoin;
  price;
  point;
  subscription;
  user;
  session;
  userId;
  prizeObj = { prize: 0, user: {} };
  pointsObj = { point: 0, user: {} };
  dbPoints;
  dbPrize;
  isLoading = false;
  wonprizeArray = [];
  userPoints = []
  userPoint = []
  scorerCounter = 0;
  user_balance = { real_amount: 0, winning_amount: 0, bonus_amount: 0, point_balance: 0, token: 0 };
  constructor(private leaguesService: LeaguesService,
    private predictwinService: PredictwinService,
    private router: Router, private utils: UtilityService,
    private service: AuthloginService) { }

  ngOnInit() {
    //this.isLoading = true;
    this.user = this.utils.getLocalStorage('user');
    this.session = this.user.data.session_key;
    this.userId = this.user.data.user_profile.user_id;
    this.pointsObj.user = this.user.data.user_profile;
    this.prizeObj.user = this.user.data.user_profile;


    // this.fetchAllPoints();
    this.fetchLeagues();
    this.fetchAllGames();
    //this.getAllUserPredictions();
    this.getTokenGamesResults();
    this.getFreeGamesResults();
    this.fetchAllPredictedGames();

  }
  fetchLeagues() {
    this.leaguesService.fetchAllLeagues(true).subscribe(
      leagues => this.leagues = leagues
    );
  }
  fetchAllPoints() {
    this.leaguesService.getUserPoint().pipe(first()).subscribe(
      data => { this.userPoints = data; console.log(data) }
    );
  }
  fetchAllGames() {
    //let nowTimeStamp = Date.now();
    let nowTimeStamp = 10 * 24 * 60 * 60 * 1000;
    // console.log(this.router.url);
    this.predictwinService.fetchAllGames('token').subscribe(
      //this.predictwinService.fetchAllTokenGames().subscribe(
      data => {
        this.predictwinService.tokenEmitter.emit(data);
      }
    );
    this.leaguesService.fetchFree('', nowTimeStamp).subscribe(
      data => {
        this.predictwinService.freeEmitter.emit(data);
        // this.router.navigate(['/predict-win/admin/manage-game/free']);
      }
    );
  }
  onSelectLeague(id) {
    // let nowTimeStamp = Date.now();
    let nowTimeStamp = 10 * 24 * 60 * 60 * 1000;

    if (this.router.url === "/predict-win/admin/manage-game/token") {
      this.predictwinService.fetchGame(id, 'token').subscribe(
        data => {
          this.predictwinService.gamesEmitter.emit(data);
        }
      );

    } else {
      this.predictwinService.fetchGame(id, ' ', ' ', nowTimeStamp).subscribe(
        data => {
          if (typeof data === 'object' || 'array') {
            this.predictwinService.gamesEmitter.emit(data);
          }
        }
      );
    }
    // console.log(id);
  }

  getFreeGamesResults() {
    this.leaguesService.fetchFreeGameResults().subscribe(
      data => { this.freeGamesResults = data; }
    )
  }
  getTokenGamesResults() {
    this.leaguesService.fetchTokenGameResults().subscribe(
      data => { this.tokenGamesResults = data; }
    )
  }
  fetchAllPredictedGames() {
    this.leaguesService.fetchPredictedGameResults().subscribe(data => { this.userPredictions = data; this.getTokenGamesResults(); })
  }


  checkAvailability(arr, userId, token?) {
    //console.log(userId)
    return arr.some(arrValue => userId === arrValue.userId)

  }
  async  predictedGamesScorer() {
    this.isLoading = true;
    let coin = 0;
    this.scorerCounter = 0
    this.userCoin = 0;
    let gameCount = 0;
    let userIdArray = [];
    let userRewardArray = [];
    this.userRewardArray = [];
    if (this.userPredictions.length > 0) {
      // console.log(this.userPredictions);

      for (let userGame in this.userPredictions) {

        if (this.freeGamesResults.length > 0) {

          for (let gameResult of this.freeGamesResults) {

            if (this.userPredictions[userGame].ID === gameResult.id) {

              if (!this.userPredictions[userGame].scored && !this.userPredictions[userGame]['has_awarded_point']) {

                // console.log( this.userPredictions[userGame].scored);
                // console.log( this.userPredictions[userGame]);
                if (this.userPredictions[userGame].button.name === gameResult.button.name &&
                  this.userPredictions[userGame].home === gameResult.home && this.userPredictions[userGame].away === gameResult.away &&
                  this.userPredictions[userGame].button.marked === gameResult.button.marked
                ) {
                  if (!this.isDuplicate.includes(this.userPredictions[userGame].ID.concat(this.userPredictions[userGame].user.userId))) {
                    this.userPredictions[userGame].result = true;
                    this.userPredictions[userGame].scored = true;
                    this.isDuplicate.push(this.userPredictions[userGame].ID.concat(this.userPredictions[userGame].user.userId));
                    this.userCoin += coin;
                    this.userPredictions[userGame]['points'] = 1;
                    this.userPredictions[userGame]['has_awarded_point'] = true;
                    if (userIdArray.includes(this.userPredictions[userGame].user.userId)) {
                      let idIndex = userIdArray.indexOf(this.userPredictions[userGame].user.userId);
                      if (idIndex !== -1) {
                        userRewardArray[idIndex].prize += 1;
                        userRewardArray[idIndex].point += 1;
                      }
                    } else {
                      userIdArray.push(this.userPredictions[userGame].user.userId);
                      userRewardArray.push({
                        user: this.userPredictions[userGame].user,
                        prize: +this.userPredictions[userGame].prize, point: +this.userPredictions[userGame].points
                      })
                    }
                    this.pointsObj.point += 1;
                    // this.GamesArray[userGame] = this.userPredictions[userGame];
                  } else {
                    this.userPredictions[userGame].scored = true;
                    this.userPredictions[userGame]['has_awarded_point'] = true;
                    //this.GamesArray[userGame] = this.userPredictions[userGame];
                  }
                  // this.GamesArray.push(this.userPredictions[userGame]);
                } else {
                  this.userPredictions[userGame]['has_awarded_point'] = true;
                  this.userPredictions[userGame].scored = true;
                  //this.GamesArray.push(this.userPredictions[userGame]);
                }
                this.GamesArray.push(this.userPredictions[userGame]);
                //this.updatePredictedGamesAfterScoring(userGame);
              } else { continue; }

            }
          }
        } else { continue }
        if (this.tokenGamesResults.length > 0) {

          if (this.userPredictions[userGame].length > 0) {
            // console.log(this.userPredictions)
            for (let gameResult of this.tokenGamesResults) {
              gameCount = 0;
              if (this.userPredictions[userGame].ID === gameResult.id) {

                for (let gResult of gameResult.game) {

                  for (let userG in this.userPredictions[userGame].game) {
                    if (!this.userPredictions[userGame].game[userG].scored) {
                      if (this.userPredictions[userGame].game[userG].away === gResult.away
                        && this.userPredictions[userGame].game[userG].home === gResult.home) {

                        if (this.userPredictions[userGame].game[userG].button.name === gResult.button.name &&
                          this.userPredictions[userGame].game[userG].button.marked === gResult.button.marked
                        ) {
                          // console.log(userG);
                          this.userPredictions[userGame].game[userG].result = true;
                          //Now the user predicted correctly, award 1 point and credit the prize too
                          gameCount++;

                          this.userPredictions[userGame].game[userG]['points'] = 3;
                          //  this.pointsObj.point += 2;
                          if (userIdArray.includes(this.userPredictions[userGame].user.userId)) {
                            let idIndex = userIdArray.indexOf(this.userPredictions[userGame].user.userId);
                            if (idIndex !== -1) {
                              // userRewardArray[idIndex].prize +=1;
                              userRewardArray[idIndex].point += 3;
                            }
                          } else {
                            userIdArray.push(this.userPredictions[userGame].user.userId);
                            userRewardArray.push({
                              user: this.userPredictions[userGame].user,
                              prize: 0, point: 3
                            })
                          }
                          if (this.userPredictions[userGame].result_count) {
                            this.userPredictions[userGame].result_count++
                          } else {
                            this.userPredictions[userGame]['result_count'] = gameCount;
                          }
                          // console.log(this.userPredictions[userGame])
                          if (this.userPredictions[userGame].result_count === this.userPredictions[userGame].length
                            && !this.userPredictions[userGame]['has_awarded_cluster_prize']) {
                            //console.log(gameCount)
                            if (userIdArray.includes(this.userPredictions[userGame].user.userId)) {
                              let idIndex = userIdArray.indexOf(this.userPredictions[userGame].user.userId);
                              if (idIndex !== -1) {
                                // userRewardArray[idIndex].prize +=1;
                                userRewardArray[idIndex].prize += +this.userPredictions[userGame].prize;
                              }
                            } else {
                              userIdArray.push(this.userPredictions[userGame].user.userid);
                              userRewardArray.push({
                                user: this.userPredictions[userGame].user,
                                prize: +this.userPredictions[userGame].prize, point: 0
                              })
                            }
                            // this.userCoin += +this.userPredictions[userGame].prize;
                            this.userPredictions[userGame]['has_awarded_cluster_prize'] = true;
                            this.userPredictions[userGame]['scored'] = true;
                          }
                          //console.log(gameCount)
                        }
                        this.userPredictions[userGame].game[userG].scored = true;
                        // this.GamesArray[userGame] = this.userPredictions[userGame];
                        this.GamesArray.push(this.userPredictions[userGame]);
                      } else { continue; }
                    } else continue
                    // console.log(this.userTokenPredictions[userGame].game[userG]);

                  }
                }

                // }
              } else continue
            }
            //
          } else continue;
        }

      }
    }
    await this.updatePredictedGamesAfterScoring(this.GamesArray);
    //}
    this.userRewardArray = userRewardArray;
    await this.updatePoints(userRewardArray)


    // this.isLoading = false;
  }
  async updatePoints(userRewardArray) {
    let count = 0;
    this.userPoints = [];
    if (userRewardArray.length > 0) {
      for (let reward of userRewardArray) {
        if (this.userPoints.length > 0) {

          for (let point of this.userPoints) {

            if (point.id === reward.user.userId) {
              reward.point += +point.point;

            } else continue
          }

        }
        //console.log(reward)
        await this.updateCoin(reward);
        await this.updateUserPoints(reward);
        //await this.leaguesService.updateUserPoint(reward.user.userId, reward);
      }
    }
  }
  updatePredictedGamesAfterScoring(userPredictions) {
    let count = 0;
    this.isLoading = true;
    if (userPredictions.length > 0) {
      for (let element of userPredictions) {
        // console.log(element)

        this.leaguesService.updateForAdmin(element)
          .then(data => { count++; if (count === userPredictions.length) this.isLoading = false; });

      }

    } else this.isLoading = false;

  }

  updateCoin(coin, ) {
    let count = 0;
    let data = { coins: coin.prize, userId: coin.user.userId }
    this.service.api('user/finance/credit_coin_reward', data, 'POST', this.session).subscribe(
      data => {
        if (data.response_code === 200) {
          // count++;if(count === this.userRewardArray.length)this.isLoading=false;
        }

      },
      error => {
        console.log(error);

        // alert(`Error: A user with id : ${data.userId} had error during  coins submission. Please add ${data.coins} coins manually to the user ` )
      }
    );
  }
  updateUserPoints(reward) {
    // console.log(reward)
    this.isLoading = true;
    let data = { points: reward.point, userId: reward.user.userId }
    this.service.api('user/finance/update_point', data, 'POST', this.session).subscribe(
      data => {
        if (data.response_code === 200) {
          this.scorerCounter++;
          if (this.scorerCounter === this.userRewardArray.length) this.isLoading = false;
        }

      },
      error => {
        console.log(error);
        // alert(`Error: A user with id : ${reward.user.userId} had error during  points submission. Please add ${reward.point} points manually to the user ` )
      }
    );
  }


}
