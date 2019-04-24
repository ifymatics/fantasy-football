import { UtilityService } from './../utility.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  contest = [];
  sports_id = 5;
  league = null;

  constructor(private router: Router, private utilityservice: UtilityService) { }

  toFirstThingFirst(contest, lineupList?, From?) {
    // console.log(contest);
    const league = contest;
    const lineupEdit = {
      league_id:    league.league_id,
      collection_master_id : league.collection_master_id,
      is_league       : league.is_league ? 1 : 0,
      lineup_master_id: league ? league.lineup_master_id : null,
      // contest_id      : league.featured_contest_id ? league.featured_contest_id : 0
  };
  // console.log(lineupEdit.lineup_master_id);
  if (From === '') {
    this.league = contest; // league.league_id;
  } else if (From === 'upcoming') {
    this.league = lineupEdit;
  }
   //  this.contest['contest'] = contest;
    // this.contest['lineup'] = lineupList;
   // this.utilityservice.setLocalStorage('contest', contest);
          setTimeout(
            () => {  this.router.navigate([this.sports_id  + '/lineup' + '/' + contest.league_id + '/' + contest.contest_id ]);
        },
         500);
         // this.league = contest.league_id;
  }
  checkLeagueId() {
    if (this.league !== null) {
      return true;
    } else {
      return false;
    }
  }
  isAbleToJoinContest(user_balance, entryFee) {
    let  isAllow = false,
          calBonusFees = 0;
    const entry_fee = Number(entryFee),
        entry_fee_ten_percentage = (entry_fee * 10 / 100),
        bonus_amount     = Number(user_balance.bonus_amount),
        real_amount      = Number(user_balance.real_amount),
        winning_amount   = Number(user_balance.winning_amount),
        calWinningAmt    = (winning_amount * 90 / 100);

        if (entry_fee_ten_percentage <= bonus_amount) {
          calBonusFees = entry_fee_ten_percentage;
        } else {
            calBonusFees = bonus_amount;
        }
        if (calBonusFees + real_amount + winning_amount >= entry_fee) {
            isAllow = true;
        }
        return isAllow;
}
  userCurrentBalance(user_balance, entryFee) {
    let  calBonusFees = 0,
         current_amount = 0;
    const entry_fee = Number(entryFee),
        entry_fee_ten_percentage = (entry_fee * 10 / 100),
        bonus_amount     = Number(user_balance.bonus_amount),
        real_amount      = Number(user_balance.real_amount),
        winning_amount   = Number(user_balance.winning_amount),
        calWinningAmt    = (winning_amount * 90 / 100);

        if (entry_fee_ten_percentage <= bonus_amount) {
            calBonusFees = entry_fee_ten_percentage;
        } else {
            calBonusFees = bonus_amount;
        }
        current_amount = calBonusFees + real_amount + winning_amount;
        return current_amount;
}
}
