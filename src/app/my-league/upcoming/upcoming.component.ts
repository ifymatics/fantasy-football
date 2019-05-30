import { DeviceDetectorService } from 'ngx-device-detector';
import { LeagueService } from './../league.service';
import { LobbyService } from './../../lobby/lobby.service';
import { Player } from './../../lineup/lineup/player.model';
import { Router, ActivatedRoute, RouterState, Params, ParamMap } from '@angular/router';
import { UtilityService } from './../../utility.service';
import { Component, OnInit, Output, Input,  ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { PlayersUtilityService } from 'src/app/players-utility.service';
import { EventEmitter } from 'events';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class UpcomingComponent implements OnInit, AfterViewInit {
  isLoading = false;
  btn = false;
  defclass;
  midclass;
  fwclass;
  isDisabled = false;
  showNoPitch = false;
  collections;
  lineupFormation = '';
  @Input() lineupDetails;
  isPopulated = false;
  mobileToggle = false;
  toggledContest: number;
 // @Output() clickedCollection: EventEmitter = new EventEmitter();
  substitutePlayerAllowed = 0;
  defPlayers = [];
  midPlayers = [];
  fwdPlayers = [];
  checkContest_id = [];
 substitutePlayersArr    = [];
 substituted_players     = [];
 selected_collection_start  = 0;
 playerActive      = {};
 playersArr        = [];
 // lineupDetails     = [];
 contestListData   = [];
 contestListRank   = [];
 currentMatch      = 'Upcoming';
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
 player_position;
 league;
 totalUserJoined = 0;
 turboLineup ;
 selectedLineupMasterContetId;
 isLoadMore        = false;
 sports_id         = 5;
 device = '';
 teamInfo: {is_turbo_lineup: number, collection_master_id: number, league_id: number,
             lineup_master_id: number, rank: '', is_quick_lineup: number, creadit_left: '' };
 viewLiveRank                = false;
 viewCompletedRank           = false;
   currentUser;
   userNameLable;
   session;
   defaultEndPosition;
   totalSalary ;
   redoPlayerId;
   message;
   status;
   match = [];
   league_id = '';
   teamName = '';
   isMobile;
   mobileDevice;
  constructor(private service: AuthloginService,
               private playerservice: PlayersUtilityService,
                private utilityservice: UtilityService,
                private router: Router,
                private route: ActivatedRoute,
                private Leagueservice: LeagueService,
                private lobbyservice: LobbyService,
                private deviceService: DeviceDetectorService,
                private cd: ChangeDetectorRef ) {
                  const state: RouterState = router.routerState;
                   const root: ActivatedRoute = state.root;
                 const child = root.firstChild;
                  // console.log(state);
                 // console.log(root);
                 // console.log(route.params);
                 }

  ngOnInit() {
  this.isLoading = true;
  this.route.params.subscribe(
    (params:  ParamMap) => {
      this.league_id = params['league_id'];
     // console.log( this.league_id);
    }
  );
  if (this.deviceService.isMobile()) {
    this.device = 'mobilePitch';
    // console.log(this.device);
    this.isMobile = true;
  } else if(this.deviceService.isDesktop) {
    this.device = 'desktopPitch';
     this.showNoPitch = false;
  }
    if (this.utilityservice.checkLocalStorageStatus('user')) {
      const user = this.utilityservice.getLocalStorage('user');
    this.currentUser      = user.user_profile;
    this.session = user.data.session_key;
    this.selectLeagueType(0);
    }
    this.defaultEndPosition = this.utilityservice.playersDefaultEndPosotion('soccer');
    /*if (this.lineupDetails.length > 0) {
      this.resetSubsTituteParams(); // Clear all substitution parameters
      this.fillPlayGround(this.lineupDetails);
      console.log(this.lineupDetails);
    }
    console.log(this.lineupDetails);*/
  this.mobileDevice = this.deviceService.isMobile();
  }
  ngAfterViewInit() {
    this.cd.detectChanges();

}

  selectLeagueType(status) {
this.isLoading = true;
// console.log(status);
    this.posting                     = true;
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
        'status':  status,
        'sports_id': this.sports_id,
        // 'league_id': 114 // this.league_id
    };
    this.service.api('fantasy/contest/get_collections_by_status', param, 'POST', this.session)
    .subscribe((response) => {
     // console.log(param);
      this.isLoading = false;
     this.posting       = false;
        this.groundLoading = false;
        response         = response.data;
        // console.log(response);
         if (!response.collections.length) {
            // this.fillPlayGround([]);
         }
        //  this.leagueservice.getContestData( response.collections);
         this.contestListData = response.collections;
        // console.warn(this.contestListData);
        this.fistItemInArray(this.contestListData);
    }, error => {
      this.isLoading = false;
       // console.log(error);
     if (error['error']['global_error'] === 'Session key has expired') {
        this.message = error['error']['global_error'];
        this.router.navigate(['/']);
     }
        this.posting = false;
    });
}
  checkDisabled() {
    // this.isDisabled = true;
  }
  backToDetails() {
    this.btn = false;
     this.isDisabled = false;
     this.isPopulated = false;
  }
  getTeamLineup(lineup, league, collection) {
    // console.log(lineup, league, collection);
    this.teamName = lineup.team_name;
    this.isLoading = true;
    this.checkContest_id = [];
    this.btn = true;
    this.checkContest_id.push(league.contest_id);
    // console.log(lineup, collection);
    // console.log(this.device);
    this.totalUserJoined = (league) ? league.total_user_joined : 0;
    this.selectedLineupMasterContetId   = lineup.lineup_master_contest_id;
   // this.teamInfo                = {is_turbo_lineup: 0};
   // this.lineupDetails           = [];
    this.selectedLineUp          = lineup;
    this.selectedLeague          = league;
    this.groundLoading           = true;
    this.userNameLable           = lineup;
    this.substitutePlayersArr    = [];
    this.substituted_players     = [];
    this.substitutePlayerAllowed = 0;
     this.setPlayersPosition();
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
           this.isLoading = false;
         this.lineupDetails                 = response.data.lineup;
        // console.log(this.lineupDetails);
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
        this.resetSubsTituteParams(); // Clear all substitution parameters
         this.fillPlayGround(this.lineupDetails);
         // console.log(this.lineupDetails);
          if (this.lineupDetails.length > 0) {
            this.isPopulated = true;
            this.deviceService.isMobile() ? this.isDisabled = true : this.isDisabled = false;
          }
     }
     }, (error) => {
       this.isLoading = false;
        this.groundLoading = false;
        // alert(UtilityService.getErrorMessage(error), 'danger');
        if (error['error']['global_error'] === 'Session key has expired') {
          this.message = error['error']['global_error'];
          this.router.navigate(['/']);
       }
        this.btn = false;
     });
   }
   fillPlayGround(lineupDetails) {
     this.defPlayers = [];
     this.midPlayers = [];
     this.fwdPlayers = [];
     let formation = '';
    const playerStartPosition = this.utilityservice.playersStartPositions();
     let dfPosition       = playerStartPosition['soccer'].DF,
    mfPosition       = playerStartPosition['soccer'].MF,
    fwPosition       = playerStartPosition['soccer'].FW;
   // If Sports is soccer and lineup list is empty set default player position
   if (!lineupDetails.length) {
    //  setDefaultMinMaxPosition();
   this.defaultEndPosition = this.utilityservice.playersDefaultEndPosotion('soccer');
   }


    this.setPlayersPosition();
    this.setDefendersPosition();
    if (!lineupDetails.length) {
      this.normalLineup = true; // Show normal lineup map
      this.turboLineup  = false; // Hide turbo lineup map
    } else if (lineupDetails.length > 4) {
       this.normalLineup = true; // Show normal lineup map
       this.turboLineup  = false; // Hide turbo lineup map
    } else if (lineupDetails.length === 4) {
      this.normalLineup = false; // Hide normal lineup map
      this.turboLineup  = true; // Show turbo lineup map
    }

      if (lineupDetails.length > 4) {
            for (const player of lineupDetails) {
               player.player_role_in_team   = (player.captain === 1) ? 'captain' : ((player.captain === 2) ? 'vice-captain' : '');

                // Condition for set players position in map for soccer
                if (this.sports_id === 5) {
                    if (player.position === 'GK') {
                          this.playersArr[0] = player;
                          this.playerActive[0] = 'active';
                    }
                    if (player.position === 'DF') {
                       this.playersArr[dfPosition] = player;
                       // this.defPlayers[dfPosition] = player;
                       this.defPlayers.push(player) ;
                       this.playerActive[dfPosition] = 'active';
                        dfPosition++;
                    }
                    if (player.position === 'MF') {
                       this.playersArr[mfPosition] = player;
                       // this.midPlayers[mfPosition] = player;
                       this.midPlayers.push(player);
                       this.playerActive[mfPosition] = 'active';
                        mfPosition++;
                    }
                    if (player.position === 'FW') {
                       this.playersArr[fwPosition] = player;
                      // this.fwdPlayers[fwPosition] = player;
                       this.fwdPlayers.push(player);
                       this.playerActive[fwPosition] = 'active';
                        fwPosition++;
                    }
                }

            }
            // console.log(this.defPlayers.length);
            // console.log(this.midPlayers.length);
            // console.log(this.fwdPlayers.length);
            if (this.defPlayers.length === 4 &&
               this.midPlayers.length === 3 &&
                this.fwdPlayers.length === 3) {
              this.fwclass = 'FW-4-3-3';
              this.defclass = 'Def-4-3-3';
              this.midclass = 'Mid-4-3-3';
              formation = '4-3-3';
              // this.utilityservice.setLocalStorage('formation', formation);
                } else  if (this.defPlayers.length === 5 &&
                  this.midPlayers.length === 3 &&
                   this.fwdPlayers.length === 2) {
                 this.fwclass = 'FW-5-3-2';
                 this.defclass = 'Def-5-3-2';
                 this.midclass = 'Mid-5-3-2';
                 formation = '5-3-2';
                // this.utilityservice.setLocalStorage('formation', formation);
                   } else  if (this.defPlayers.length === 5 &&
                    this.midPlayers.length === 4 &&
                     this.fwdPlayers.length === 1) {
                   this.fwclass = 'FW-5-4-1';
                   this.defclass = 'Def-5-4-1';
                   this.midclass = 'Mid-5-4-1';
                   formation = '5-4-1';
                  // this.utilityservice.setLocalStorage('formation', formation);
                     } else  if (this.defPlayers.length === 4 &&
                      this.midPlayers.length === 5 &&
                       this.fwdPlayers.length === 1) {
                     this.fwclass = 'FW-4-5-1';
                     this.defclass = 'Def-4-5-1';
                     this.midclass = 'Mid-4-5-1';
                     formation = '4-5-1';
                    // this.utilityservice.setLocalStorage('formation', formation);
                       } else  if (this.defPlayers.length === 3 &&
                        this.midPlayers.length === 4 &&
                         this.fwdPlayers.length === 3) {
                       this.fwclass = 'FW-3-4-3';
                       this.defclass = 'Def-3-4-3';
                       this.midclass = 'Mid-3-4-3';
                       formation = '3-4-3';
                      // this.utilityservice.setLocalStorage('formation', formation);
                         } else  if (this.defPlayers.length === 3 &&
                          this.midPlayers.length === 5 &&
                           this.fwdPlayers.length === 2) {
                         this.fwclass = 'FW-3-5-2';
                         this.defclass = 'Def-3-5-2';
                         this.midclass = 'Mid-3-5-2';
                         formation = '3-5-2';
                        // this.utilityservice.setLocalStorage('formation', formation);
                           } else  if (this.defPlayers.length === 5 &&
                            this.midPlayers.length === 3 &&
                             this.fwdPlayers.length === 2) {
                           this.fwclass = 'FW-5-3-2';
                           this.defclass = 'Def-5-3-2';
                           this.midclass = 'Mid-5-3-2';
                           formation = '5-3-2';
                          // this.utilityservice.setLocalStorage('formation', formation);
                             }
                             this.lineupFormation = formation;
                             console.log(this.lineupFormation);
                     this.utilityservice.setLocalStorage('formation', formation);

      } else {
        lineupDetails.forEach((player, key) => {
                this.playersArr[key]   = player;
                this.playerActive[key] = 'active';
            });
      }
}
setPlayersPosition() {
  this.playersArr = [];
   this.playerActive = {};
  const playersOnMap = 13;
  for (let i = 0; i <= playersOnMap; i++) {
      this.playersArr.push({});
  }
   // console.warn( this.playersArr);
}
setDefendersPosition() {
  this.defPlayers = [];
   this.playerActive = {};
  const playersOnMap = 5;
  for (let i = 0; i <= playersOnMap; i++) {
      this.playersArr.push({});
  }
   // console.warn( this.playersArr);
}
resetSubsTituteParams() {
  // vm.substituteBtn = false;
  this.substitutePlayersArr = []; // Clear temprary substitude array
  this.redoPlayerId = {}; // Clear player_id to assigned from remove player click in html
 }
 gotoLineup(league) {
   if (this.utilityservice.checkLocalStorageStatus('private_games') &&
   this.utilityservice.checkLocalStorageStatus('lineupDetails') ) {
     this.utilityservice.clearLocalStorage('private_games');
     this.utilityservice.clearLocalStorage('lineupDetails');
   }
  this.utilityservice.setLocalStorage('private_games', this.selectedLeague);
  this.utilityservice.setLocalStorage('lineupDetails', this.lineupDetails);
 // console.log(league);
 // console.log(this.lineupDetails);
  if (this.teamInfo.is_turbo_lineup === 1) {

      this.router.navigate(['/turbolineup', {
          position        : league.position,
          league_id       : league.league_id,
          collection_master_id : league.collection_master_id,
          is_league       : league.is_league ? 1 : 0,
          lineup_master_id: league ? league.lineup_master_id : null,
          // contest_id      : league.featured_contest_id ? league.featured_contest_id : 0
      }]);
  } else {
    const lineup = league;
      this.lobbyservice.toFirstThingFirst(league, lineup, 'upcoming' );
  }
}
onSelectTeam(myTeam, leagues, collections) {
// console.log(myTeam.value, leagues);
// this.getTeamLineup(myTeam, leagues, collections);
this.selectTeam (myTeam, leagues, collections);

}
selectTeam (myTeam, leagues, collections) {
  // console.log(myTeam.value, leagues);
  for (const team of leagues['teams']) {
  //  console.log(team.team_name);
      if (team.team_name === myTeam.value) {
      //  console.log(team.team_name);
        this.getTeamLineup(team, leagues, collections);
      }
  }
}
mobileContestInfo(contestId) {
  // console.log(contestId);
  if ( this.toggledContest === contestId) {
    this.toggledContest = 0;
    this.mobileToggle = !this.mobileToggle;
  } else {
    this.toggledContest = contestId;
    this.mobileToggle = !this.mobileToggle;
  }
}
fistItemInArray(contestListData) {
  let collections = { contests: []};
  let leagues = {teams: []};
  let leaguesteam = {};
  for (let i = 0; i <= contestListData.length; i++) {
    if (i === 0) {
      collections = contestListData[i];
      for (let j = 0; j <= collections.contests.length; j++) {
        if (i === 0) {
        leagues = collections.contests[i];
        for (let k = 0; k <= leagues.teams.length; k++ ) {
            if (i === 0) {
                leaguesteam = leagues.teams[i];
            }
        }
        }
       // console.log(collections, leagues, leaguesteam);
        this.getTeamLineup(leaguesteam, leagues, collections);
      }
     }
  }
}
}
