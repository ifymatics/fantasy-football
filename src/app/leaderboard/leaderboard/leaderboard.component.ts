import { AuthloginService } from 'src/app/user/authlogin.service';
import { UtilityService } from './../../utility.service';
import { Component, OnInit , AfterViewInit} from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  class = false;
  active = '';
  mobile = false;
  maLeague;
  managerId = '';
 posting          = false;
 emptyScreen      = false;
 initFlag  = true;
 session = '';
 currentUser ;
 selectedLeagueId = '';
 arrayIndex = -1;
 leaderboardList;
 OwnLeaderboard;
 state_params     = {};
 selectedSport;
 LeagueList: League[];
 League;
 duration;
 selectedLeague;
 select2Option = {
      minimumResultsForSearch: -1,
      // allowClear:true
  };
// Sorting Methods
 sort = {
      sort_order: 'DESC',
      sort_field: 'total_score'
  };

  league_detail = {'background_image': ''};
  constructor(private utilityservice: UtilityService,
    private service: AuthloginService) { }

  ngOnInit() {
    if (this.utilityservice.checkLocalStorageStatus('user')) {
      const user = this.utilityservice.getLocalStorage('user');
    this.currentUser      = user.user_profile;
    this.session = user.data.session_key;
    this.selectedSport = this.utilityservice.getLocalStorage('selectedSport');
    this.getLeaderboardData();
    }
  }
  // ngAfterViewInit(): void {
  //   // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //   // Add 'implements AfterViewInit' to the class.
  //   setTimeout(() => {
  //     this.getLeaderboardList(this.maLeague, '', true) ;
  //     console.log(this.maLeague);
  // }, 5000);
  // }
  getLeaderboardData() {
    const param = {
      'sports_id' : 5 // this.selectedSport.sports_id
    };
    this.service.api('fantasy/leaderboard/leaderboard_matser_data', param, 'POST', this.session)
    .subscribe(
      (response) => {
      response = response.data;
      this.LeagueList = response.league_list;
     // console.log(response, this.LeagueList[0]);
         this.League = (this.LeagueList.length) ? this.LeagueList[0] : {};
         this.getLeaderboardList(this.League, '', true);
         // console.log(this.League);
         /*$rootScope.league_detail = this.League;
         $rootScope.league_detail = {'background_image':''};*/
      this.duration = response.duration;
    }, (error) => {
      console.log(error);
    });
  }
  getLeaderboardList(league, Duration, init) {
    const param = {
            'league_id' : this.League.league_id,
            'duration'  : Duration || '',
            'sort_field': this.sort.sort_field,
            'sort_order': this.sort.sort_order
        };
    if (init && this.initFlag) {
        this.selectedLeague = league;
     this.initFlag = false;
     this.callLeaderboardList(param);
        this.league_detail = {'background_image': league.background_image};
   }
   if (!init) {
        this.selectedLeague = league;
     this.callLeaderboardList(param);
        this.league_detail = {'background_image': league.background_image};
   }
}

callLeaderboardList(param) {
    this.emptyScreen = false;
    this.posting = true;
   this.service.api('fantasy/leaderboard/leaderboard_list', param, 'POST', this.session)
   .subscribe(
     (response) => {
     response = response.data;
        this.leaderboardList = response.leaderboard;
     this.OwnLeaderboard = response.own_leaderboard;
        this.posting = false;
        this.emptyScreen = (!this.leaderboardList.length) ? true : false;

    },  (error) => {
        this.posting = false;
     console.log(error);
   });
}
sortEvent(sort_field, league, Duration) {
  this.sort.sort_order                 = (this.sort.sort_order === 'ASC') ? 'DESC' : 'ASC';
  this.sort.sort_field                 = sort_field;
  const param = {
          'league_id' : league.league_id,
          'duration'  : Duration || '',
          'sort_field': this.sort.sort_field,
          'sort_order': this.sort.sort_order
      };

  this.callLeaderboardList(param);
}
toggleContestInfo(ownboard) {
  this.managerId = '';
  this.managerId = ownboard.user_id;
  this.mobile = !this.mobile;
// console.log(ownboard);
}


onClick(index) {
  // console.log(index);
  this.active = 'active';
  this.arrayIndex = index;
}
}
