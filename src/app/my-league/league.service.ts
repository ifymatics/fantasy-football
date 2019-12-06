import { Router } from '@angular/router';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { ModalService } from './../modal.service';
import { Injectable, EventEmitter } from '@angular/core';
import { UtilityService } from '../utility.service';
 class JoinGameInitObj  {
   contest: Object; lineup: Object;
  currentbalance: Number; lineuplist: []; userbalance: Object ;
}

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  collection = new EventEmitter();
  message;
  currentUser;
  session;
  joinGameInitObj: JoinGameInitObj;
  contestListData = {contest: {}};
  constructor(private modalservice: ModalService,
     private utilityservice: UtilityService,
     private service: AuthloginService,
     private router: Router ) { }
  getContestDataOnviewNavigate (contestData: {}) {
    this.contestListData.contest = {};
    if (contestData !== null) {
      this.contestListData.contest = contestData;
    }
    console.log(this.contestListData.contest);
  }
  getContestData() {
    if (this.contestListData.contest !== {}) {
      console.log(this.contestListData);
      return this.contestListData;
    } else {
      return;
    }
  }
  joinGameInit(_CONTEST, _LINEUP, _CURRENTBALANCE, _LINEUPLIST, _USERBALANCE) {
    // console.log(joinGameInitObj);
    // return JoinGameInitObj;
      this.joinGameInitObj = {
        contest: _CONTEST,
        lineup: _LINEUP,
        currentbalance: _CURRENTBALANCE,
        lineuplist: _LINEUPLIST,
        userbalance: _USERBALANCE
      };
  }
  joinGameModals(contest, lineup, lineupList, isTurbo) {
    const user = this.utilityservice.getLocalStorage('user').data;
    this.currentUser = user.user_profile;
    this.session = user.session_key;
    const entryFee = Number(contest.entry_fee);
    const param = {
            'user_id' : this.currentUser.user_id,
        };
    this.service.api('user/finance/get_user_balance', param, 'POST', this.session)
    .subscribe((response) => {
           const  user_balance   = response.data.user_balance,
            etry_free      = parseFloat(contest.entry_fee),
            point_balance  = parseFloat(user_balance.point_balance);
            let currentBalance = response.data.user_balance.real_amount;
            currentBalance = Number(currentBalance);
          console.log(currentBalance);
        if (!this.utilityservice.isAbleToJoinContest(user_balance, entryFee)
         && (contest.prize_type === 0 || contest.prize_type === 1)) {  // Condition for entry fee system
            // show notEnoughCashModal \\
            // this.notEnoughCashInit(entryFee, user_balance, contest);
        } else if ((etry_free > point_balance) && (contest.prize_type === 2 || contest.prize_type === 3)) { // Condition for coin system
           // show notEnoughCashModal \\
            // this.notEnoughCashInit(entryFee, user_balance, contest);
        } else {
                // console.log('you ARE ALLOWED');
            this.joinGameInit(contest, lineup, currentBalance, lineupList, user_balance);
        }
    },
    error => {
      if (error['error']['global_error'] === 'Session key has expired') {
        this.message = error['error']['global_error'];
        this.router.navigate(['/']);
      }
    }
    );
   }
}
