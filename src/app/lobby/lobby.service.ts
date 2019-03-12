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

  toFirstThingFirst(contest, lineupList?) {
    console.log(contest);
    const league = contest;
    const lineupEdit = {
      league_id:    league.league_id,
      collection_master_id : league.collection_master_id,
      is_league       : league.is_league ? 1 : 0,
      lineup_master_id: league ? league.lineup_master_id : null,
      // contest_id      : league.featured_contest_id ? league.featured_contest_id : 0
  };
  console.log(lineupEdit.lineup_master_id);
  if (lineupEdit.lineup_master_id === null || '') {
    this.league = contest; // league.league_id;
  } else {
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
}
