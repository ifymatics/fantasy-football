import { DeviceDetectorService } from 'ngx-device-detector';
import { LobbyService } from './../../lobby/lobby.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, ParamMap } from '@angular/router';
import { PlayersUtilityService } from './../../players-utility.service';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { UtilityService } from './../../utility.service';
import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../league.service';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss']
})
export class LeaguesComponent implements OnInit {
  message;
  device = 'desktopPitch';
  defaultEndPosition;
  contestTypes = [];
 selected_collection_start  = 0;
 playerActive      = {};
 playersArr        = [];
 lineupDetails     = [];
 contestListData   = [];
 contestListRank   = [];
 currentMatch      = 'Upcoming';
 teamInfo: {is_turbo_lineup: number, collection_master_id: number, league_id: number,
  lineup_master_id: number, rank: '' };
 seasonganeUid     = '';
 isSelected        = {};
 selectedUserId    = '';
 groundLoading     = true;
 posting           = false;
 emptyScreen       = false;
 creaditleft       = 0;
 contestListOffset = 0;
 loadMorePosting   = false;
 normalLineup      = true;
 collection_detail = {};
 selectedLineUp    = {};
 selectedLeague    = {};
 substituted_count = 0;
 league;
 player_position;
 totalSalary;
 totalUserJoined = 0;
 selectedLineupMasterContetId;
 isLoadMore        = false;
 sports_id         = 5;
 viewLiveRank                = false;
 viewCompletedRank           = false;
   currentUser;
   userNameLable;
   redoPlayerId;
   isLoading = false;
   league_id = '';
  // -----------------------------Live Substitution Params---------------------------------------
 remaining_salary_cap    = 0;
 substitutePlayerAllowed = 0;
 substitutePlayersArr    = [];
 undoBtn                 = {};
 substitutedData         = {};
 salary_cap              = 0;
 substituted_players  = [];
 session;
 status;
 cssActive = false;
myLeagueArray = [];
 playersMinMaxData       = {
      'GK': { max_player_per_position: '1', number_of_players: '1', position: 'GK' },
      'DF': { max_player_per_position: '5', number_of_players: '3', position: 'DF' },
      'MF': { max_player_per_position: '5', number_of_players: '3', position: 'MF' },
      'FW': { max_player_per_position: '3', number_of_players: '1', position: 'FW' }
  };

  constructor(private utilityService: UtilityService,
              private service: AuthloginService,
               private playerservice: PlayersUtilityService,
               private router: Router,
               private lobbyservice: LobbyService,
               private leagueservice: LeagueService,
               private route: ActivatedRoute,
               private deviceService: DeviceDetectorService) {
                }

  ngOnInit() {
    this.route.params.subscribe(
      (params: ParamMap) => {
         this.league_id = params['league_id'];
        // console.log(this.league_id);
        //  this.router.navigate([this.sports_id + '/' + this.league_id +'/my-league/live']);
      }
    );

    // console.log(this.route.snapshot);
    if (this.deviceService.isMobile()) {
      this.device = 'mobilePitch';
    } else {
      this.device = 'desktopPitch';
    }
    if (this.utilityService.checkLocalStorageStatus('user')) {
      const user = this.utilityService.getLocalStorage('user');
    this.currentUser      = user.user_profile;
    this.session = user.data.session_key;
    this.cssActive = true;
    this.myLeagueArray = [1];
    }
    this.playerservice. setPlayersPosition();
  }

  selectLeagueType(status) {
    this.isLoading = true;
    if (status === 0) {
      this.myLeagueArray = [];
      this.myLeagueArray.push(0);
      this.router.navigate(['upcoming'], {relativeTo: this.route});
    } else if (status === 1) {
      this.myLeagueArray = [];
      this.myLeagueArray.push(1);
      this.router.navigate(['live'], {relativeTo: this.route});
    } else {
      this.myLeagueArray = [];
      this.myLeagueArray.push(2);
      this.router.navigate(['completed'], {relativeTo: this.route});
    }
    this.status = status;


   /* this.posting                     = true;
    this.groundLoading               = true;
    this.isSelected                  = {};
    // this.lineupDetails               = [];
    // this.playersArr                  = [];
    // this.playerActive                = {};
    this.contestListData             = [];
    this.viewLiveRank                = false;
    this.viewCompletedRank           = false;
    this.currentMatch                = (status === 0) ? 'Upcoming' : ((status === 1) ? 'Live' : 'Complete');
    this.isSelected[this.currentMatch] = 'active';
    const param = {
        'status': status,
        'sports_id':  this.sports_id
    };
    this.service.api('fantasy/contest/get_collections_by_status', param, 'POST', this.session)
    .subscribe((response) => {
     this.posting       = false;
        this.groundLoading = false;
        response         = response.data;
         console.log(response);
         if (!response.collections.length) {
            // this.fillPlayGround([]);
         }
         this.leagueservice.getContestData( response.collections);
         this.contestListData = response.collections;
         console.warn(this.contestListData);
         this.router.navigate([this.sports_id + '/my-league', status]);
    }, (error) => {
      console.log(error['error']['global_error']);
      if (error['error']['global_error'] === 'Session key has expired') {
        this.message = error['error']['global_error'];
        this.router.navigate(['/']);
      }
        this.posting = false;
    });*/
}



getTeamLineup(lineup, league, collection) {
 // console.log(league, lineup, collection);
  this.totalUserJoined = (league) ? league.total_user_joined : 0;
  this.selectedLineupMasterContetId   = lineup.lineup_master_contest_id;
 // this.teamInfo                = {is_turbo_lineup: 0};
  this.lineupDetails           = [];
  this.selectedLineUp          = lineup;
  this.selectedLeague          = league;
  this.userNameLable           = lineup;
  this.substitutePlayersArr    = [];
  this.substituted_players     = [];
  this.substitutePlayerAllowed = 0;
   if (collection) {
      this.selected_collection_start = collection.collection_start_status;
   }
   // this.selectedContest = league.contest_id;
   // Clear selcted substitute rosters
   const param = {
       'lineup_master_contest_id': lineup.lineup_master_contest_id
   };
   this.service.api('fantasy/contest/get_linpeup_with_score', param, 'POST', this.session)
   .subscribe(
     (response) => {
      this.groundLoading = false;
       if (response.response_code === 200) {
       this.lineupDetails                 = response.data.lineup;
       this.teamInfo                      = response.data.team_info;
       this.teamInfo.collection_master_id =  response.data.lineup[0].collection_master_id;
       this.teamInfo.league_id            =  response.data.lineup[0].league_id;
       this.teamInfo.lineup_master_id     =  response.data.lineup[0].lineup_master_id;
       this.teamInfo.rank                 =  this.router.isActive('livecontest', true)  ?
        lineup.current_rank : lineup.game_rank; // New Changes
       this.totalSalary                   = response.data.total_salary_cap;
       this.substitutePlayerAllowed       = (response.data.substituted_count === 0) ? 2
       : ((response.data.substituted_count === 2) ? 0
       : response.data.substituted_count);
       // 0 (2 substitute available), 2 (0 substitution allowed)
       this.substituted_players           = response.data.substituted_players;
       // Set position for turbo linup
       // console.log(this.lineupDetails);
      //  console.log(this.playersArr);
           if (response.data.team_info.is_turbo_lineup === '1') {
             this.player_position = response.data.team_info.turbo_lineup_type;
           }
   }
   }, (error) => {
      this.groundLoading = false;
      // alert(UtilityService.getErrorMessage(error), 'danger');
      alert('error');
   });
 }

}
