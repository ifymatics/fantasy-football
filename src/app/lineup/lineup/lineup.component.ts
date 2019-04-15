import { ContestJoinService } from './../../contest-join.service';
import { ModalService } from './../../modal.service';
import { LeagueService } from './../../my-league/league.service';
import { PlayerRoles } from './captain.model';
import { PlayersUtilityService } from './../../players-utility.service';
import { FormGroup, FormControl, FormControlName, FormBuilder, Validators } from '@angular/forms';
import { CollectionDetails } from './collection-details.model';
import { LobbyService } from './../../lobby/lobby.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { UtilityService } from './../../utility.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Player } from './player.model';
import { forEach } from '@angular/router/src/utils/collection';
import { ConditionalExpr } from '@angular/compiler';
import { TouchSequence } from 'selenium-webdriver';
import { pipe, empty } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { isEmpty, timeout } from 'rxjs/Operators';
import { LineupRoutingModule } from '../lineup-routing.module';
class JoinGameInitObj  {
  contest: Object; lineup: Object;
 currentbalance: Number; lineuplist: []; userbalance: Object ;
}

@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.scss']
})
export class LineupComponent implements OnInit {
  @ViewChild('playerList') playerList: ModalDirective;
  @ViewChild('formationModal') formationModal: ModalDirective;
  @ViewChild('selectCaptain') selectCaptain: ModalDirective;
  @ViewChild('joinGameConfirmModal') joinGameConfirmModal: ModalDirective;
  @ViewChild('captain') captain: ElementRef;
  @ViewChild('viceCaptain') viceCaptain: ElementRef;
  @ViewChild('team_name') team_name: ElementRef;
  @ViewChild('def1') def1: ElementRef;
  @ViewChild('def2') def2: ElementRef;
  @ViewChild('def3') def3: ElementRef;
  @ViewChild('def4') def4: ElementRef;
  @ViewChild('def5') def5: ElementRef;
  // for fwdfielders
  @ViewChild('mf1') mf1: ElementRef;
  @ViewChild('mf2') mf2: ElementRef;
  @ViewChild('mf3') mf3: ElementRef;
  @ViewChild('mf4') mf4: ElementRef;
  @ViewChild('mf5') mf5: ElementRef;
  // forwards
  @ViewChild('fwd1') fwd1: ElementRef;
  @ViewChild('fwd2') fwd2: ElementRef;
  @ViewChild('fwd3') fwd3: ElementRef;
  @ViewChild('fwd4') fwd4: ElementRef;
  @ViewChild('fwd5') fwd5: ElementRef;
   searchPlayerForm;
   confirmJoinForm;
   searchBoxForm;
   message;
   inits;
  defendersArray = [];
  midfieldersArray = [];
  forwardsArray = [];
  goalkeepersArray = [];
  session;
  defLi;
  mfLi = '';
  fwLi;
  gkLi;
  currentUser;
  myLineupList;
  isLoading = false;
  playerObj = {
    fourThreeThree: {
      def: {
         def1: {} as Player, def2: {} as Player,
        def3: {} as Player, def4: {} as Player
        },
    mid: {
      mid1: {} as Player, mid2: {} as Player, mid3: {} as Player,
      },
    fwd: {
      fwd1: {} as Player, fwd2: {} as Player, fwd3: {} as Player
      },
    gk:  {
          gk1: {} as Player
        }
    },
    threeFourThree: {
      def: {
        def1: {} as Player,
        def2:  {} as Player,
        def3: {} as Player,
     },
      mid: {
      mid1: {} as Player,
      mid2: {} as Player,
      mid3: {} as Player,
      mid4: {} as Player
      },
      fwd: {
      fwd1: {} as Player,
      fwd2: {} as Player,
      fwd3: {} as Player
      },
        gk: {
        gk1: {} as Player
         }
    },
    fiveFourOne: {
      def: {
      def1: {} as Player,
      def2: {} as Player,
      def3: {} as Player,
      def4: {} as Player,
      def5: {} as Player
      },
      mid: {
      mid1: {} as Player,
      mid2: {} as Player,
      mid3: {} as Player,
      mid4: {} as Player, },
    fwd: {fwd1: {} as Player },
      gk: {
      gk1: {} as Player
       }
    },
    fourFiveOne: {
      def: {
      def1: {} as Player,
      def2: {} as Player,
      def3: {} as Player,
      def4: {} as Player,
        },
      mid: {
      mid1: {} as Player,
      mid2: {} as Player,
      mid3: {} as Player,
      mid4: {} as Player,
      mid5: {} as Player },
    fwd: {fwd1: {} as Player },
      gk: {
      gk1: {} as Player
       }
    },
    fourFourTwo: {
      def: {
      def1: {} as Player,
      def2: {} as Player,
      def3: {} as Player,
      def4: {} as Player,
       },
      mid: {
      mid1: {} as Player,
      mid2: {} as Player,
      mid3: {} as Player,
      mid4: {} as Player, },
      fwd: {
      fwd1: {} as Player,
      fwd2: {} as Player
       },
       gk: {
      gk1: {} as Player
       }
    },
    fiveTwoThree: {
      def: {
      def1: {} as Player,
      def2: {} as Player,
      def3: {} as Player,
      def4: {} as Player,
      def5: {} as Player },
    mid: {mid1: {} as Player,
      mid2: {} as Player},
      fwd: {
        fwd1: {} as Player,
          fwd2: {} as Player,
          fwd3: {} as Player
          },
          gk: {
          gk1: {} as Player
           }
    },
    fiveThreeTwo: {
    def: {def1: {} as Player,
    def2: {} as Player,
      def3: {} as Player,
      def4: {} as Player,
      def5: {} as Player },
      mid: {
      mid1: {} as Player,
      mid2: {} as Player,
      mid3: {} as Player
      },
    fwd: {fwd1: {} as Player,
          fwd2: {} as Player
          },
          gk: {
          gk1: {} as Player
           }
    },
    threeFiveTwo: {
      def: {
      def1: {} as Player,
      def2: {} as Player,
      def3: {} as Player,
        },
      mid: {
      mid1: {} as Player,
      mid2: {} as Player,
      mid3: {} as Player,
      mid4: {} as Player,
      mid5: {} as Player
      },
    fwd: {fwd1: {} as Player,
          fwd2: {} as Player
          },
          gk: {
          gk1: {} as Player
           }
    }
   };
   playerIndex = [];
  playerOnPitch = [];
  isPicked = false;
deviceInfo = null;
  isMobile = false;
  isDesktopDevice = false;
  isTablet = false;
  formationSelected = '4-3-3';
  playersData = [];
  sportsIds = {
    soccer: 5
  };
  headingTitle = 'All Player';
  sports_id = 5;
  selectedPlayersCount = { 'All': 0, 'FW': 0, 'MF': 0, 'DF': 0, 'GK': 0 };
  playersAbbr = {'GK': 'goalkeeper', 'FW': 'forward', 'MF': 'midfielder', 'DF': 'defender' };
playerCalled = [];
league_detail;
default_total_players = 11;
lineupLoading = false;
loadMorePosting = false;
currentPage = 1;
allRosterslist = [];
allRosterslistCopy = [];
isLoadMore ;
lineup_master_id = '';
lineupPage = '';
loadPlayers = false;
defaultTeam = { 'All': 'active' };
captainObj =  {
  captain: '' , viceCaptain: '', team_name: ''
 };
masterLineupData = [];
allTeamslist = [];
playersArr = [];
lineupDetails = []; // Array for lineup edit
leagueList = [];
finalSelectedPlayersArr = [];
btnRemoveRoster = {};
btnAddRoster = {};
playerActive = {};
teamFull = {};
playersMinMaxData = {}
isPosting = true; /* as {
  'GK': {'max_player_per_position': ''},
  'FW': {'max_player_per_position': ''},
  'DF': {'max_player_per_position': ''}
}*/;
salary_cap = 0;
used_salary_cap = 0;
remaining_salary_cap = 0;
posting = false;
emptyScreen = false;
playerCartDetail = [];
collection_detail: CollectionDetails;
playerDetail = {};
selectedCollection = {};
contest_detail = {};
selectedPlayerData = [];
featuredContestList;
isEditMode = false;
defaultEndPosition;
contest;
allLeaguelist = [];
lineupSubmitBtn = false;
is_disable_selection = false;
onAnimate = false;
joinGameInitObj;
contestList;
resolved = {league_id: '', collection_master_id: '', sports_id: '' };
playersDefaultLength = {
  'GK': { start: 0, end: 0 }, 'DF': { start: 1, end: 5 }, 'MF': { start: 6, end: 10 }, 'FW': { start: 11, end: 13 }
};
filter = { sort_order: 'DESC', sort_field: 'total_point', team_league_id: '', position: '' };
  constructor( private utilityService: UtilityService, private service: AuthloginService,
    private lobbyservice: LobbyService, private router: Router,
     private route: ActivatedRoute,  private deviceService: DeviceDetectorService,
     private playerservice: PlayersUtilityService,
     private leagueservice: ContestJoinService,
     private modalservice: ModalService) {
       this.epicFunction();
     }
   datas = {
    'league_id': '',
    'sports_id': 5,
    'collection_master_id': ''
  };
  ngOnInit() {
   // this.inits;
    let user;
    if (this.utilityService.checkLocalStorageStatus('user')) {
     // this.datas.league_id
    // this.datas.collection_master_id = this.utilityService.getLocalStorage('contest').collection_master_id;
      user = this.utilityService.getLocalStorage('user');
     // console.log( user['data']['user_profile'].user_name);
    this.currentUser =  user.data.user_profile;
    }
    this.confirmJoinForm = new FormGroup({
      'lineup': new FormControl(null, [Validators.required]),
     // 'create': new FormControl(null, [Validators.required]),
    });
    this.myLineupList  = this.utilityService.getLocalStorage('myLineupList');
    // this.service.isLoggedIn = this.utilityService.checkLocalStorageStatus('user');
    this.defaultEndPosition = this.utilityService.playersDefaultEndPosotion('soccer');
    this.setPlayersPosition();
    this.session =  user.data.session_key ;
    this.route.paramMap.subscribe(
      (params: Params) => {
        this.datas.sports_id = params.params.sports_id;
        this.datas.league_id = params.params.league_id;
        // console.log(params.params.league_id);
      }
       );
       this.route.data.subscribe(

         (data: Data) => {
          // console.log(data);
           if (typeof data.contest === 'object') {
             this.contest = data.contest;
            if (data.contest.lineup_master_id) {
              this.lineup_master_id = data['contest'].lineup_master_id ;
              this.datas.collection_master_id = data.contest.collection_master_id;
              this.lineupPage = 'edit';
             if (this.utilityService.checkLocalStorageStatus('lineupdetails')) {
                this.formationSelected = this.utilityService.checkLocalStorageStatus('formation') ?
                this.utilityService.getLocalStorage('formation') : '';
                this.lineupDetails = this.utilityService.getLocalStorage('lineupdetails');
                // this.fillPlayGround();
             }
             // console.log(this.contest);
              console.log(this.lineupDetails);
             } else if (data.contest.collection_master_id){
              this.datas.collection_master_id = data.contest.collection_master_id;
             if (this.utilityService.checkLocalStorageStatus('collection_master_id')) {
               this.utilityService.clearLocalStorage('collection_master_id');
               this.utilityService.setLocalStorage('collection_master_id', data.contest.collection_master_id);
             } else {
            // console.log(data.contest.league_id);
            this.utilityService.setLocalStorage('collection_master_id',data.contest.collection_master_id);
             }
           // this.lineupPage = 'add';
           }
           } else {
            if (this.utilityService.checkLocalStorageStatus('collection_master_id')) {
              this.datas.collection_master_id = this.utilityService.getLocalStorage('collection_master_id');
            }
         }
       }
       );
       // this.getCollectionDetail();
       this.lineupPage = (this.lineup_master_id === '' ) ? 'add' : 'edit';
   // console.log( this.route.data);
  //  console.log(this.lineupDetails);
    // console.log(this.route.data['value'].contest['contest']);
    if (this.session) {
     this.contestList = this.utilityService.getLocalStorage('contestList');
       this.getLineupMasterData();
       // console.log(this.contest);
    /* this.service.api('fantasy/cricket_lineup/lineup/get_lineup_master_data', this.datas, 'post', user.data.session_key)
      .subscribe(
        data => {
         if (data['response_code'] === 200) {
           // console.warn(reqParams);
           // console.warn(response);
           this.masterLineupData = data['data'].all_position;
           this.salary_cap = data['data'].salary_cap;
           this.remaining_salary_cap = data['data'].salary_cap;
           this.captainObj.team_name = data['data'].team_name;
           // this.masterLineupData.forEach(obj => {
             for (const obj of this.masterLineupData ) {
             this.defaultTeam[obj.position] = '';
             if (obj.position !== 'All') {
                 this.playersMinMaxData[obj.position] = obj;
             } else {
                 this.defaultTeam[obj.position] = 'active';
             }
            }
            // });
            this.league_detail = data['data'].league_data;
           if (this.lineupPage === 'edit') {
                this.getUsersLineUp();
           }
       }
       console.log(this.lineupPage);
        // console.log(data);
       }, error => {
          if (error['error']['global_error'] === 'Session key has expired') {
            this.message = error['error']['global_error'];
            this.router.navigate(['/']);
          }
       });
      if (this.lineupPage === 'add') {
       this.getAllRosters();
     }
       } else {this.router.navigate(['/']);*/ }
  }
  onSelectPlayer(playerType) {
    // this.setPlayersPosition();
 //  console.log(playerType);
  }


getAllRosters() {
  this.isLoading = true;
  // allRosterslist       = [];
  this.lineupLoading = true;
  this.emptyScreen = false;
  this.posting = true;
  this.loadMorePosting = true;

  const reqParams = {
      'items_perpage': 700,
      'current_page': this.currentPage,
      'sort_order': this.filter.sort_order,
      'sort_field': this.filter.sort_field,
      'team_league_id': this.filter.team_league_id,
      'league_id':  this.datas.league_id,
      'sports_id': 5, // this.resolved.sports_id,
      'position': this.filter.position,
      'collection_master_id':  this.datas.collection_master_id
  };

  this.service.api('fantasy/cricket_lineup/lineup/get_all_roster', reqParams, 'POST', this.session)
  .subscribe( (response) => {
      if (response['response_code'] === 200) {
        this.isLoading = false;
          response = response['data'];
           console.log(response);
           console.log(reqParams);
           this.allRosterslist = this.allRosterslist.concat(response['result']);
          this.emptyScreen = (this.allRosterslist.length) ? false : true;
          this.loadMorePosting = false;
          this.isLoadMore = response['is_load_more'];
          if (response['is_load_more'] === 'true' || response['is_load_more'] === true) {
              this.currentPage++;
              this.posting = true;
              // console.log(this.currentPage);
          } else {
            this.posting = false;
          }
      }
      this.lineupLoading = false;
  },  (error) => {
    // console.log(error['global_error']);
      // alert(error['global_error']);
      this.router.navigate(['/']);
      this.posting = false;
      this.loadMorePosting = false;
      this.lineupLoading = false;
  });
}

showModalBasedOnDevice(playerType, def?, liType?) {
 // console.warn(def);
if (playerType === 'DF') {
  this.defLi = '';
  this.defLi = def;
  console.warn(this.defLi);
} else if (playerType === 'MF') {
  this.mfLi = '';
  this.mfLi = def ;
} else if (playerType === 'FW') {

  this.fwLi = '';
  this.fwLi = def ;
  console.log(this.fwLi);
} else if(playerType === 'GK') {
  this.gkLi = '';
  this.gkLi = def;
}

 console.log(playerType);
  const isMobile = this.deviceService.isMobile();
  const isDesktopDevice = this.deviceService.isDesktop();
  const isTassblet = this.deviceService.isTablet();
  const result =  this.allRosterslist.filter(type => type['position'] === playerType );
  this.allRosterslistCopy = result;
  this.headingTitle = this.playersAbbr[playerType];
  if (isMobile || isTassblet && !isDesktopDevice ) {
  this.playerList.show();
  } else {
    this.playerList.hide();
  }
  console.log(isMobile);
  console.log(this.deviceService.device);
}
epicFunction() {
  this.deviceInfo = this.deviceService.getDeviceInfo();
  const isMobile = this.deviceService.isMobile();
  const isTablet = this.deviceService.isTablet();
  const isDesktopDevice = this.deviceService.isDesktop();
  // console.log(this.deviceInfo);
  // console.log(isMobile + 'for mobile');  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
  // console.log(isTablet + '  for tablet');  // returns if the device us a tablet (iPad etc)
  // console.log(isDesktopDevice + ' for desktop'); // returns if the app is running on a Desktop browser.
  // console.log(this.deviceService.device);
}
 checkSelectedRosters(playerId) {
  const checkPlayerSelected = this.utilityService.filterArr(this.playersArr, 'player_id', playerId);
  if (checkPlayerSelected.length) {
      return true;
  } else {
      return false;
  }
}
onSelectFormation(isSelected: string) {
 this.formationSelected = isSelected;
 this.formationModal.hide();
 this.allRosterslistCopy = [];
 this.defendersArray = [];
 this.goalkeepersArray = [];
 this.midfieldersArray = [];
 this.forwardsArray = [];
}
onSelectedPlayer( data: Player) {
  this.playerIndex.push(data.player_id);
  // console.log(this.playerIndex);
 //  console.log(data);
  this.isPicked = true;
}
trackByPlayers(index: number, playerSelect: Player): number {
    return playerSelect.player_id;
  //  this.playerIndex.push(index);
   // console.log(playerSelect.player_id);
   // return index;
  }
   countSelectedPlayers() {
    this.setPlayersCount();
    this.finalSelectedPlayersArr = [];
    for (let i = 0; i < this.playersArr.length; i++) {
        // delete this.playersArr[i]['$$hashKey'];
        const playerObj = Object.keys(this.playersArr[i]);
        if (playerObj.length) {
         // console.log(playerObj);
            this.selectedPlayersCount.All++;
            this.selectedPlayersCount[this.playersArr[i].position]++;
            this.finalSelectedPlayersArr.push(this.playersArr[i]);
            // broadcast('checkSelectedPlayers', { playersCount: this.selectedPlayersCount });//Broadcast selected players
        }
    }

    if (this.finalSelectedPlayersArr.length === this.default_total_players) {
         this.captainSelection();
    }
}
captainSelection (arg?) {
  if (arg === 'hide') {
    this.selectCaptain.hide();
  } else {
    this.selectCaptain.show();
  }
}
joinGameModals(contest, lineup, lineupList, isTurbo) {
  console.log(contest);
  // joinGameModals(contest, lineup, lineupList, isTurbo) {
   // const user = this.utilityService.getLocalStorage('user').data;
    // this.currentUser = user.user_profile;
    // this.session = user.session_key;
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
        if (!this.utilityService.isAbleToJoinContest(user_balance, entryFee)
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
   // }
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
    this.joinGameConfirmModal.show();
    // this.modalservice.showJoinConfirm();
    console.log(this.joinGameInitObj);
}
setPlayersCount() {
  if (this.sports_id === this.sportsIds.soccer) {
      this.selectedPlayersCount = { 'All': 0, 'GK': 0, 'DF': 0, 'MF': 0, 'FW': 0 };
  }
 }
 findPlayerPosition(playerType) {
  const start = this.playersDefaultLength[playerType].start,
  end = this.playersDefaultLength[playerType].end;

  for (let i = start; i <= end; i++) {
   console.log(this.playersArr);
      // delete this.playersArr[i]['$$hashKey'];
      const objLength = Object.keys(this.playersArr[i]).length;
      const keys = Object.keys(this.playersArr[i]);
      // console.log(keys);
      if (!objLength) {
        // console.log(objLength + 'length');
          return i;
      }
  }
  return null;
}
calculateSalaryCap(used_salary_cap, isAction) {

  if (isAction === 'editOnload') {
      const remainingPlayer = this.default_total_players - this.selectedPlayersCount.All;
      this.remaining_salary_cap = (this.salary_cap - used_salary_cap);
      const final_salary_cap = (remainingPlayer) ? (this.remaining_salary_cap / remainingPlayer) : used_salary_cap;
      // Condition for check 11 players (if players size 11 it will show only 0 amount)
      this.used_salary_cap = (this.selectedPlayersCount.All === this.default_total_players ||
         this.selectedPlayersCount.All === 0) ? 0 : parseFloat(final_salary_cap);
  } else if (isAction === 'remove') {
      this.remaining_salary_cap = (this.remaining_salary_cap) + parseFloat(used_salary_cap);
      const remainingPlayer = this.default_total_players - this.selectedPlayersCount.All;
      const final_salary_cap = (remainingPlayer) ? (this.remaining_salary_cap / remainingPlayer) : this.remaining_salary_cap;
      // Condition for check 11 players (if players size 11 it will show only 0 amount)
      this.used_salary_cap = (this.selectedPlayersCount.All === this.default_total_players ||
         this.selectedPlayersCount.All === 0) ? 0 : (+final_salary_cap);
  } else if (isAction === 'add') {
       this.remaining_salary_cap = (+this.remaining_salary_cap) - parseFloat(used_salary_cap);
       const remainingPlayer = this.default_total_players - this.selectedPlayersCount.All;
       const final_salary_cap = (remainingPlayer) ? (this.remaining_salary_cap / remainingPlayer) : this.remaining_salary_cap;
      // Condition for check 11 players (if players size 11 or 0 it will show only 0 amount)
      this.used_salary_cap = (this.selectedPlayersCount.All === this.default_total_players ||
         this.selectedPlayersCount.All === 0) ? 0 : (+final_salary_cap);
         // console.log( this.used_salary_cap);
  }
}
validateTeam(playerType, playerId) {
 let isValid = true;
          let message = '';
          const selectedPlayers = this.utilityService.filterArr(this.playersArr, 'position', playerType),
          playerIndex = this.utilityService.findObjPosition(this.allRosterslist, 'player_id', playerId),
          playerDetail = this.allRosterslist[playerIndex],
          playersLength = this.playersMinMaxData,
          maxAllowed = playersLength[playerType].max_player_per_position,
          minAllowed = playersLength[playerType].number_of_players;
          const maxPlayersPerTeam = this.finalSelectedPlayersArr.filter(function (obj) {
              return obj.team_abbreviation === playerDetail.team_abbreviation;
          });

          // Validate 11 players in team
          if (this.finalSelectedPlayersArr.length === this.default_total_players) {
            alert('only maximum of 11 players allowed');
              isValid = false;
              return false;
          }

          // Validate players salary cap
          const salary = parseFloat(playerDetail.salary);
          if (salary > this.remaining_salary_cap) {
            alert('Insufficient credit balance. Please select another player');
              // emitAlert.on('Insufficient credit balance. Please select another player', 'danger');
              isValid = false;
          }

          // Validate only 6 players in one team
          if (maxPlayersPerTeam.length === 4 && isValid) {
            alert('Only Maximum of 4 players allowed from 1 team');
             // emitAlert.on('Max 4 players allowed from 1 team', 'danger');
              isValid = false;
          }

          // Validate max players in team
          if (isValid) {
              if (maxAllowed === selectedPlayers.length) {
                alert('Max ' + maxAllowed + ' ' + this.playersAbbr[playerType] + ' allowed');
                  // emitAlert.on('Max ' + maxAllowed + ' ' + playersAbbr[playerType] + ' allowed', 'danger');
                  isValid = false;
              }
          }

          // Start Team complete validation logic
          /* Logic
           * Check Current selected player min length is completed.
           * if min length is completed then check other team condition
           */
          if ((this.selectedPlayersCount[playerType] >= this.playersMinMaxData[playerType].number_of_players) && isValid) {
           // console.log(maxAllowed );
              // first check calculate only WK,BAT,AR not All then Calculate players remaining min length
              let remainingMinPlayerCount = 0;
              for (const objKey of Object.keys( this.selectedPlayersCount))  {
                // if (this.selectedPlayersCount.hasOwnProperty(objKey)) {
                  if (objKey !== 'All' && this.selectedPlayersCount[objKey] < this.playersMinMaxData[objKey].number_of_players) {
                      const minPlayerCount = this.selectedPlayersCount[objKey];
                      remainingMinPlayerCount += (+this.playersMinMaxData[objKey].number_of_players) - (+minPlayerCount);
                     // console.log( remainingMinPlayerCount );
                  }
                // }
              }

              // Calculate Remainig players length formula (total(11)-selected)
              const remainingPlayerCount = this.default_total_players - ( +this.selectedPlayersCount['All']);
                message = '';
                let remainingPlayer = '';
              // Condition for get min length player
             for (const key of Object.keys( this.selectedPlayersCount)) {
               // if (this.selectedPlayersCount.hasOwnProperty(key)) {
                const minCount = (key !== 'All') ? this.playersMinMaxData[key].number_of_players : 0;

                if (key !== 'All' && (this.selectedPlayersCount[key] < minCount)) {
                  console.log(minCount);
                  console.log(this.selectedPlayersCount[key]);
                    remainingPlayer = key;
                    console.log(remainingPlayer);
                    return true;
                }
               // }
             }

              //  Condition for check remaining player min length count equal to remainig player count
              if (remainingMinPlayerCount === remainingPlayerCount) {
                  message = 'Every team needs at least'
                  + this.playersMinMaxData[remainingPlayer].number_of_players + ' ' + this.playersAbbr[remainingPlayer] + '';
                  // Check message is exist or not
                  if (message) {
                    alert(message);
                      // emitAlert.on(message, 'danger');
                      isValid = false;
                       return false;
                  }
              }
          }

          //  End Team complete validation logic
          return isValid;
      }

       // Add player
        addPlayer(player, playerType) {
          // if (this.defLi !== '') {
          let maxPlayers = 0;
          const playerIndex = this.utilityService.findObjPosition(this.allRosterslist, 'player_id', player.player_id),
          playerPosition = this.findPlayerPosition(playerType),
          isValidate =  this.validateTeam(playerType, player.player_id);
          maxPlayers = this.playersMinMaxData[playerType]['max_player_per_position'];
          // console.log(playerIndex + 'playerIndex');
          // console.log( playerPosition + ' playerPosition');
          // console.log( isValidate + ' isValidate');
          // console.log(  maxPlayers + '  maxPlayers');
          // Condition for check wicketkeeper
          if (playerPosition !== null && isValidate ) {
           // this.playersArr[playerPosition] = this.allRosterslist[playerIndex];
            const salary = parseFloat(this.allRosterslist[playerIndex].salary);
            this.playerLiDom(player, playerIndex, playerPosition, playerType, maxPlayers);
            // this.playerStatusCheck (playerId, playerIndex, playerPosition, playerType, maxPlayers) ;
           /* this.playerActive[playerPosition] = true;
            this.playersArr[playerPosition] = this.allRosterslist[playerIndex];
            // this.playerLiDom(this.playersArr[playerPosition]);
            // console.log( this.playersArr[allow_substitution]);
           // this.pArray(this.playersArr[playerPosition]);
           // this.playerLiDom(this.playersArr[playerPosition]);
            this.btnAddRoster[playerId] = true;
            this.btnRemoveRoster[playerId] = true;
            this.selectedPlayerData.push(this.allRosterslist[playerIndex]);
           // this.pArray(this.playersArr[playerPosition]);
            // console.log( this.selectedPlayerData);
            // console.log( maxPlayers );
            this.playerLiDom(this.playersArr[playerPosition], playerId, playerIndex, playerPosition, playerType, maxPlayers);
            // this.countSelectedPlayers();
            this.calculateSalaryCap(salary, 'add'); // Calculate remainig amount
            this.teamFull[playerType] = (this.selectedPlayersCount[playerType] === maxPlayers) ? 'full' : '';
            this.teamFull['All'] = (this.selectedPlayersCount['All'] === this.default_total_players) ? 'full' : '';
              */

              // this.playerList.hide();
           // }
          }
      }

      /*
       * Remove selected players
       */
        removePlayer(playerId, playerType, removeFrom, formationtype?) {
          const playerIndex = this.utilityService.findObjPosition(this.playersArr, 'player_id', playerId),
          playerPositionIndex = this.utilityService.findObjPosition(this.masterLineupData, 'position', playerType),
          maxPlayers = (playerPositionIndex !== -1) ? this.masterLineupData[playerPositionIndex]['max_player_per_position'] : 1,
          salary =  this.playersArr[playerIndex].salary;
          const selectedPlayerIndex = this.utilityService.findObjPosition(this.selectedPlayerData, 'player_id', playerId);
          this.selectedPlayerData.splice(selectedPlayerIndex, 1);
          this.playersArr[playerIndex] = {};
          this.removeItemFromArray(playerId, selectedPlayerIndex);
          this.playerActive[playerIndex] = false;
          this.btnRemoveRoster[playerId] = false;
          this.btnAddRoster[playerId] = false;
          this.countSelectedPlayers();
           this.calculateSalaryCap(salary, 'remove'); // Calculate remainig amount
          this.teamFull[playerType] = (this.selectedPlayersCount[playerType] === maxPlayers) ? 'full' : '';
          this.teamFull['All'] = (this.selectedPlayersCount['All'] === this.default_total_players) ? 'full' : '';
          this.playerRemover(playerId, playerType, removeFrom, formationtype);
          if (removeFrom === 'map') {
             // this.filterTeamPlayers('position', 'All'); // If user removed on map tab redirect All tab
             // console.log(this.formationSelected);
             this.showModalBasedOnDevice(playerType, formationtype);
            // this.playerList.show();
             // this.playerRemover(playerId, playerType, removeFrom, formationtype);

          }
          if (this.captainObj.captain === playerId) {
              this.captainObj.captain = '';
          }
          if (this.captainObj.viceCaptain === playerId) {
              this.captainObj.viceCaptain = '';
          }
      }
      resetSelectedPlayers = function () {
        this.playerActive = {};
        this.finalSelectedPlayersArr = [];
        this.remaining_salary_cap = this.salary_cap;
        this.captainObj.captain = '';
        this.captainObj.viceCaptain = '';
        this.used_salary_cap = 0; // new condition added
        this.selectedPlayerData = [];
        this.defendersArray = [];
        this.midfieldersArray = [];
        this.forwardsArray = [];
        this.goalkeepersArray = [];
          for (const key in this.teamFull) {
            if (this.teamFull.hasOwnProperty(key)) {
              this.teamFull[key] = '';
            }
          }
          this.autoDeletePlayers();
          for (const key in this.playersArr) {
            if (this.playersArr.hasOwnProperty(key)) {
            this.playerActive[key] = false;
            const playerObj = key;
            this.defendersArray = [];
            this.midfieldersArray = [];
            this.forwardsArray = [];
            this.goalkeepersArray = []; // Object.keys(obj);
            if (playerObj.length) {
                this.btnAddRoster[this.playersArr[key]['player_id']] = false;
                this.btnRemoveRoster[this.playersArr[key]['player_id']] = false;
            }
          }
        }
        this.setPlayersPosition();
        this.setPlayersCount();
    };
 filterPlayertype() {
  const result = this.playersArr.filter(type => type === this.allRosterslist['position'] );
  return result;
 }
 onLoadMorePlayers() {
  this.getAllRosters();
 }
 playerLiDom(player, playerIndex, playerPosition, playerType, maxPlayers) {

  // console.log(player);
   if (player.position === 'DF') {
    if (this.formationSelected === '4-3-3') {
      console.log(this.defendersArray);
      console.log(this.midfieldersArray);
      console.log(this.forwardsArray);
      console.log(this.goalkeepersArray);
      console.log(player.position);
      if (this.defLi === 'def1') {
       this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
         this.playerObj.fourThreeThree.def.def1 = player;
         this.defendersArray.push(player.player_id);
         if (this.defendersArray.length === 4) { this.playerList.hide(); }
         this.defLi = '';
      } else if (this.defLi === 'def2') {
       this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
       this.playerObj.fourThreeThree.def.def2 = player;
       console.log('defender two');
         console.log(this.defendersArray);
       this.defendersArray.push(player.player_id);
       if (this.defendersArray.length === 4) { this.playerList.hide(); }
       this.defLi = '';
      } else if (this.defLi === 'def3') {
       this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
       this.playerObj.fourThreeThree.def.def3 = player;
       this.defendersArray.push(player.player_id);
       if (this.defendersArray.length === 4) { this.playerList.hide(); }
       this.defLi = '';
      } else if (this.defLi === 'def4') {
       this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourThreeThree.def.def4 = player;
      this.defendersArray.push(player.player_id);
      if (this.defendersArray.length === 4) { this.playerList.hide(); }

      this.defLi = '';
      }  else if(!this.defendersArray.includes(player.player_id )
      && !this.midfieldersArray.includes(player.player_id )
      && !this.forwardsArray.includes(player.player_id)
      && !this.goalkeepersArray.includes(player.player_id ) ) {
        // if (this.defendersArray.length<4) {
           console.log('till here');
         this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
       // }
     }
   }  else if (this.formationSelected === '3-4-3') {
      if (this.defLi === 'def1') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.threeFourThree.def.def1 = player;
        this.defendersArray.push(player.player_id);
        if (this.defendersArray.length === 3) { this.playerList.hide(); }
        this.defLi = '';
     } else if (this.defLi === 'def2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.threeFourThree.def.def2 = player;
      this.defendersArray.push(player.player_id);
      if (this.defendersArray.length === 3) { this.playerList.hide(); }
      this.defLi = '';
     } else if (this.defLi === 'def3') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.threeFourThree.def.def3 = player;
        this.defendersArray.push(player.player_id);
        if (this.defendersArray.length === 3) { this.playerList.hide(); }
        this.defLi = '';
     }  else if (!this.defendersArray.includes
      (player.player_id) && player.position === 'DF') {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    } else if (this.formationSelected === '4-5-1') {
      if (this.defLi === 'def1') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.fourFiveOne.def.def1 = player;
        this.defendersArray.push(player.player_id);
        if (this.defendersArray.length === 4) { this.playerList.hide(); }
        this.defLi = '';
     } else if (this.defLi === 'def2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFiveOne.def.def2 = player;
      this.defendersArray.push(player.player_id);
      if (this.defendersArray.length === 4) { this.playerList.hide(); }
      this.defLi = '';
     } else if (this.defLi === 'def3') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFiveOne.def.def3 = player;
      this.defendersArray.push(player.player_id);
      if (this.defendersArray.length === 4) { this.playerList.hide(); }
      this.defLi = '';
     } else if (this.defLi === 'def4') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.fourFiveOne.def.def4 = player;
        this.defendersArray.push(player.player_id);
        if (this.defendersArray.length === 4) { this.playerList.hide(); }
        this.defLi = '';
     }  else if (!this.defendersArray.includes
      (player.player_id) && player.position === 'DF') {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    } else if (this.formationSelected === '5-4-1') {
      if (this.defLi === 'def1') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.fiveFourOne.def.def1 = player;
        // console.log(player);
        this.defLi = '';
     } else if (this.defLi === 'def2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveFourOne.def.def2 = player;
      this.defLi = '';
     } else if (this.defLi === 'def3') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveFourOne.def.def3 = player;
      this.defLi = '';
     } else if (this.defLi === 'def4') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveFourOne.def.def4 = player;
      this.defLi = '';
     } else if (this.defLi === 'def5') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveFourOne.def.def5 = player;
      this.defLi = '';
     }  else if (!this.defendersArray.includes
      (player.player_id) && player.position === 'DF') {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    } else if (this.formationSelected === '4-4-2') {
      if (this.defLi === 'def1') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.fourFourTwo.def.def1 = player;
        this.defLi = '';
        // console.log(player);
     } else if (this.defLi === 'def2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFourTwo.def.def2 = player;
      this.defLi = '';
     } else if (this.defLi === 'def3') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFourTwo.def.def3 = player;
      this.defLi = '';
     } else if (this.defLi === 'def4') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFourTwo.def.def4 = player;
      this.defLi = '';
     }  else if (!this.defendersArray.includes
      (player.player_id) && player.position === 'DF') {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    } else if (this.formationSelected === '3-5-2') {
      if (this.defLi === 'def1') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.threeFiveTwo.def.def1 = player;
        this.defLi = '';
        // console.log(player);
     } else if (this.defLi === 'def2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.threeFiveTwo.def.def2 = player;
      this.defLi = '';
     } else if (this.defLi === 'def3') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.threeFiveTwo.def.def3 = player;
      this.defLi = '';
     }  else if (!this.defendersArray.includes
      (player.player_id) && player.position === 'DF') {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    } else if (this.formationSelected === '5-2-3') {
      if (this.defLi === 'def1') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.fiveTwoThree.def.def1 = player;
        this.defLi = '';
        // console.log(player);
     } else if (this.defLi === 'def2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveTwoThree.def.def2 = player;
      this.defLi = '';
     } else if (this.defLi === 'def3') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveTwoThree.def.def3 = player;
      this.defLi = '';
     } else if (this.defLi === 'def4') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveTwoThree.def.def4 = player;
      this.defLi = '';
     }  else if (this.defLi === 'def5') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveTwoThree.def.def5 = player;
      this.defLi = '';
     }
    } else if (!this.defendersArray.includes
      (player.player_id) && player.position === 'DF') {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
} else if (player.position === 'MF') {
  if (this.formationSelected === '4-3-3') {
   if (this.mfLi === 'mf1') {
    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
     this.playerObj.fourThreeThree.mid.mid1 = player;
     this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 3) { this.playerList.hide(); }
     this.mfLi = '';
    } else if (this.mfLi === 'mf2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
     this.playerObj.fourThreeThree.mid.mid2 = player;
     this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 3) { this.playerList.hide(); }
     this.mfLi = '';
  } else if (this.mfLi === 'mf3') {
    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
     this.playerObj.fourThreeThree.mid.mid3 = player;
     this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 3) { this.playerList.hide(); }
     this.mfLi = '';
  }  else if (!this.midfieldersArray.includes
    (player.player_id) ) {
      this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
    }
 } else if (this.formationSelected === '3-4-3') {
  if (this.mfLi === 'mf1') {
    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
    this.playerObj.threeFourThree.mid.mid1 = player;
     this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
     this.mfLi = '';
   } else if (this.mfLi === 'mf2') {
    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
    this.playerObj.threeFourThree.mid.mid2 = player;
     this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
     this.mfLi = '';
 } else if (this.mfLi === 'mf3') {
  this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
  this.playerObj.threeFourThree.mid.mid3 = player;
   this.midfieldersArray.push(player.player_id);
   if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
   this.mfLi = '';
   } else if (this.mfLi === 'mf4') {
    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
    this.playerObj.threeFourThree.mid.mid4 = player;
     this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
     this.mfLi = '';
   } else if (!this.midfieldersArray.includes
    (player.player_id) ) {
      this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
    }
  } else if (this.formationSelected === '4-5-1') {
    if (this.mfLi === 'mf1') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFiveOne.mid.mid1 = player;
       this.midfieldersArray.push(player.player_id);
       if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
       this.mfLi = '';
     } else if (this.mfLi === 'mf2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFiveOne.mid.mid2 = player;
       this.midfieldersArray.push(player.player_id);
       if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
       this.mfLi = '';
   } else if (this.mfLi === 'mf3') {
    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
    this.playerObj.fourFiveOne.mid.mid3 = player;
     this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
     this.mfLi = '';
     } else if (this.mfLi === 'mf4') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFiveOne.mid.mid4 = player;
       this.midfieldersArray.push(player.player_id);
       if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
       this.mfLi = '';
     } else if (this.mfLi === 'mf5') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFiveOne.mid.mid5 = player;
       this.midfieldersArray.push(player.player_id);
       if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
       this.mfLi = '';
     } else if (!this.midfieldersArray.includes
      (player.player_id) ) {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    } else if (this.formationSelected === '5-4-1') {
      if (this.mfLi === 'mf1') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveFourOne.mid.mid1 = player;
      this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
     this.mfLi = '';
       } else if (this.mfLi === 'mf2') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveFourOne.mid.mid2 = player;
      this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
     this.mfLi = '';
     } else if (this.mfLi === 'mf3') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveFourOne.mid.mid3 = player;
      this.midfieldersArray.push(player.player_id);
     if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
     this.mfLi = '';
       } else if (this.mfLi === 'mf4') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.fiveFourOne.mid.mid4 = player;
        this.midfieldersArray.push(player.player_id);
       if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
       this.mfLi = '';
       } else if (!this.midfieldersArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
        }
      } else if (this.formationSelected === '4-4-2') {
        if (this.mfLi === 'mf1') {
          this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
          this.playerObj.fourFourTwo.mid.mid1 = player;
          this.midfieldersArray.push(player.player_id);
         if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
         this.mfLi = '';
         } else if (this.mfLi === 'mf2') {
          this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
          this.playerObj.fourFourTwo.mid.mid2 = player;
          this.midfieldersArray.push(player.player_id);
         if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
         this.mfLi = '';
       } else if (this.mfLi === 'mf3') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.fourFourTwo.mid.mid3 = player;
        this.midfieldersArray.push(player.player_id);
       if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
       this.mfLi = '';
         } else if (this.mfLi === 'mf4') {
          this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
          this.playerObj.fourFourTwo.mid.mid4 = player;
          this.midfieldersArray.push(player.player_id);
         if (this.midfieldersArray.length === 4) { this.playerList.hide(); }
         this.mfLi = '';
         } else if (!this.midfieldersArray.includes
          (player.player_id) ) {
            this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          }
        } else if (this.formationSelected === '5-3-2') {
          if (this.mfLi === 'mf1') {
            this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
            this.playerObj.fiveThreeTwo.mid.mid1 = player;
          this.midfieldersArray.push(player.player_id);
         if (this.midfieldersArray.length === 3) { this.playerList.hide(); }
         this.mfLi = '';
           } else if (this.mfLi === 'mf2') {
            this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
            this.playerObj.fiveThreeTwo.mid.mid2 = player;
          this.midfieldersArray.push(player.player_id);
         if (this.midfieldersArray.length === 3) { this.playerList.hide(); }
         this.mfLi = '';
         } else if (this.mfLi === 'mf3') {
          this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
          this.playerObj.fiveThreeTwo.mid.mid3 = player;
        this.midfieldersArray.push(player.player_id);
       if (this.midfieldersArray.length === 3) { this.playerList.hide(); }
       this.mfLi = '';
           } else if (!this.midfieldersArray.includes
            (player.player_id) ) {
              this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
            }
          } else if (this.formationSelected === '3-5-2') {
            if (this.mfLi === 'mf1') {
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj.threeFiveTwo.mid.mid1 = player;
            this.midfieldersArray.push(player.player_id);
           if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
           this.mfLi = '';
             } else if (this.mfLi === 'mf2') {
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj.threeFiveTwo.mid.mid2 = player;
            this.midfieldersArray.push(player.player_id);
           if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
           this.mfLi = '';
           } else if (this.mfLi === 'mf3') {
            this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
            this.playerObj.threeFiveTwo.mid.mid3 = player;
          this.midfieldersArray.push(player.player_id);
         if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
         this.mfLi = '';
             } else if (this.mfLi === 'mf4') {
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj.threeFiveTwo.mid.mid4 = player;
            this.midfieldersArray.push(player.player_id);
           if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
           this.mfLi = '';
             } else if (this.mfLi === 'mf5') {
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj.threeFiveTwo.mid.mid5 = player;
            this.midfieldersArray.push(player.player_id);
           if (this.midfieldersArray.length === 5) { this.playerList.hide(); }
           this.mfLi = '';
             }
            } else if (!this.midfieldersArray.includes
              (player.player_id) ) {
                this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
              }
         } else if (player.position === 'FW') {
          if (this.formationSelected === '4-3-3') {
           if (this.fwLi === 'fwd1') {
            this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
           this.playerObj.fourThreeThree.fwd.fwd1 = player;
           this.forwardsArray.push(player.player_id);
           if (this.forwardsArray.length === 3) { this.playerList.hide(); }
           this.fwLi = '';
          } else if (this.fwLi === 'fwd2') {
            this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
          this.playerObj.fourThreeThree.fwd.fwd2 = player;
          this.forwardsArray.push(player.player_id);
          if (this.forwardsArray.length === 3) { this.playerList.hide(); }
          this.fwLi = '';
         } else if (this.fwLi === 'fwd3') {
          this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
          this.playerObj.fourThreeThree.fwd.fwd3 = player;
          this.fwLi = '';
          this.forwardsArray.push(player.player_id);
          if (this.forwardsArray.length === 3) { this.playerList.hide(); }
         } else if (!this.forwardsArray.includes
          (player.player_id) ) {
            this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          }
       } else if (this.formationSelected === '3-4-3') {
        if (this.fwLi === 'fwd1') {
          this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.threeFourThree.fwd.fwd1 = player;
        this.forwardsArray.push(player.player_id);
          if (this.forwardsArray.length === 3) { this.playerList.hide(); }
          this.fwLi = '';
       } else if (this.fwLi === 'fwd2') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.threeFourThree.fwd.fwd2 = player;
        this.forwardsArray.push(player.player_id);
          if (this.forwardsArray.length === 3) { this.playerList.hide(); }
          this.fwLi = '';
      } else if (this.fwLi === 'fwd3') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.threeFourThree.fwd.fwd3 = player;
        this.forwardsArray.push(player.player_id);
          if (this.forwardsArray.length === 3) { this.playerList.hide(); }
          this.fwLi = '';
      }  else if (!this.forwardsArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
        }
     } else if (this.formationSelected === '4-5-1') {
      if (this.fwLi === 'fwd1') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFiveOne.fwd.fwd1 = player;
      this.forwardsArray.push(player.player_id);
        if (this.forwardsArray.length === 1) { this.playerList.hide(); }
        this.fwLi = '';
      }  else if (!this.forwardsArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
        }
     } else if (this.formationSelected === '5-4-1') {
      if (this.fwLi === 'fwd1') {
        this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
        this.playerObj.fiveFourOne.fwd.fwd1 = player;
        this.forwardsArray.push(player.player_id);
          if (this.forwardsArray.length === 1) { this.playerList.hide(); }
          this.fwLi = '';
        }  else if (!this.forwardsArray.includes
          (player.player_id) ) {
            this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          }
     } else if (this.formationSelected === '4-4-2') {
      if (this.fwLi === 'fwd1') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFourTwo.fwd.fwd1 = player;
      this.forwardsArray.push(player.player_id);
        if (this.forwardsArray.length === 2) { this.playerList.hide(); }
        this.fwLi = '';
     } else if (this.fwLi === 'fwd2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFourTwo.fwd.fwd2 = player;
      this.forwardsArray.push(player.player_id);
        if (this.forwardsArray.length === 2) { this.playerList.hide(); }
        this.fwLi = '';
     }  else if (!this.forwardsArray.includes
      (player.player_id) ) {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    } else if (this.formationSelected === '5-3-2') {
      if (this.fwLi === 'fwd1') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveThreeTwo.fwd.fwd1 = player;
      this.forwardsArray.push(player.player_id);
        if (this.forwardsArray.length === 2) { this.playerList.hide(); }
        this.fwLi = '';
     } else if (this.fwLi === 'fwd2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveThreeTwo.fwd.fwd2 = player;
      this.forwardsArray.push(player.player_id);
        if (this.forwardsArray.length === 2) { this.playerList.hide(); }
        this.fwLi = '';
     }  else if (!this.forwardsArray.includes
      (player.player_id) ) {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    } else if (this.formationSelected === '3-5-2') {
      if (this.fwLi === 'fwd1') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.threeFiveTwo.fwd.fwd1 = player;
      this.forwardsArray.push(player.player_id);
        if (this.forwardsArray.length === 2) { this.playerList.hide(); }
        this.fwLi = '';
     } else if (this.fwLi === 'fwd2') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.threeFiveTwo.fwd.fwd2 = player;
      this.forwardsArray.push(player.player_id);
        if (this.forwardsArray.length === 2) { this.playerList.hide(); }
        this.fwLi = '';
     }  else if (!this.forwardsArray.includes
      (player.player_id) ) {
        this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
      }
    }
  } else if (player.position === 'GK') {
      ///////////////////////////////////////
     this.fillKeeper(player,playerIndex, playerPosition, playerType, maxPlayers, 'fromAuto');
      ///////////////////////////////////////
    }
}
fillKeeper(player,playerIndex?, playerPosition?, playerType?, maxPlayers?, auto?) {
  if (this.formationSelected === '4-3-3') {
     if (this.gkLi === 'gk') {
    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
    this.playerObj.fourThreeThree.gk.gk1 = player;
    this.goalkeepersArray.push(player.player_id);
    if (this.goalkeepersArray.length === 1) { this.playerList.hide(); }
          this.gkLi = '';
    }  else if (!this.goalkeepersArray.includes
      (player.player_id) ) {
        console.log('still working heeree');
        if (auto === 'fromAuto') {
            this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
        }
        this.playerObj.fourThreeThree.gk.gk1 = player;
        this.goalkeepersArray.push(player.player_id);
      }
  } else if (this.formationSelected === '5-4-1') {
    if (this.gkLi === 'gk') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveFourOne.gk.gk1 = player;
    this.goalkeepersArray.push(player.player_id);
    if (this.goalkeepersArray.length === 1) { this.playerList.hide(); }
          this.gkLi = '';
      } else if (!this.goalkeepersArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          this.playerObj.fiveFourOne.gk.gk1 = player;
        }
   } else if (this.formationSelected === '4-4-2') {
    if (this.gkLi === 'gk') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFourTwo.gk.gk1 = player;
    this.goalkeepersArray.push(player.player_id);
    if (this.goalkeepersArray.length === 1) { this.playerList.hide(); }
          this.gkLi = '';
      } else if (!this.goalkeepersArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          this.playerObj.fourFourTwo.gk.gk1 = player;
        }
   } else if (this.formationSelected === '4-5-1') {
    if (this.gkLi === 'gk') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fourFiveOne.gk.gk1 = player;
    this.goalkeepersArray.push(player.player_id);
    if (this.goalkeepersArray.length === 1) { this.playerList.hide(); }
          this.gkLi = '';
      } else if (!this.goalkeepersArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          this.playerObj.fourFiveOne.gk.gk1 = player;
        }
   } else if (this.formationSelected === '5-3-2') {
    if (this.gkLi === 'gk') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveThreeTwo.gk.gk1 = player;
    this.goalkeepersArray.push(player.player_id);
    if (this.goalkeepersArray.length === 1) { this.playerList.hide(); }
          this.gkLi = '';
      } else if (!this.goalkeepersArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          this.playerObj.fourFiveOne.gk.gk1 = player;
        }
   } else if (this.formationSelected === '3-5-2') {
    if (this.gkLi === 'gk') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.threeFiveTwo.gk.gk1 = player;
    this.goalkeepersArray.push(player.player_id);
    if (this.goalkeepersArray.length === 1) { this.playerList.hide(); }
          this.gkLi = '';
      } else if (!this.goalkeepersArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          this.playerObj.fourFiveOne.gk.gk1 = player;
        }
   } else if (this.formationSelected === '5-2-3') {
    if (this.gkLi === 'gk') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.fiveTwoThree.gk.gk1 = player;
    this.goalkeepersArray.push(player.player_id);
    if (this.goalkeepersArray.length === 1) { this.playerList.hide(); }
          this.gkLi = '';
      } else if (!this.goalkeepersArray.includes
        (player.player_id) ) {
          this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          this.playerObj.fourFiveOne.gk.gk1 = player;
        }
   } else if (this.formationSelected === '3-4-3') {
    if (this.gkLi === 'gk') {
      this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
      this.playerObj.threeFourThree.gk.gk1 = player;
    this.goalkeepersArray.push(player.player_id);
    if (this.goalkeepersArray.length === 1) { this.playerList.hide(); }
          this.gkLi = '';
      } else if (!this.goalkeepersArray.includes
        (player.player_id) ) {
         this.onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers);
          this.playerObj.fourFiveOne.gk.gk1 = player;
        }
   }

}
pArray(playersArray) {
  console.log(playersArray);
   console.log(this.playersArr);
  if (playersArray.position === 'DF') {
    this.defendersArray = playersArray;
    // console.log(playersArray.position);
  } else if (playersArray.position === 'MF') {
   this.midfieldersArray = playersArray;
   // console.log(playersArray.position);
 } else if (playersArray.position === 'FW') {
   this.forwardsArray = playersArray;
   // console.log(playersArray.position);
 } else {
   this.goalkeepersArray = playersArray;
 }
}
setPlayersAddBtnStatus() {
  for (const playerObj of this.playersArr) {
      if (playerObj.position) {
          this.btnRemoveRoster[playerObj.player_id] = false;
          this.btnAddRoster[playerObj.player_id] = false;
      }
  }
}

fillPlayGround() {
  this.resetSelectedPlayers();
  const playerStartPosition = this.utilityService.playersStartPositions();
  let dfPosition = playerStartPosition['soccer'].DF,
  mfPosition = playerStartPosition['soccer'].MF,
  fwPosition = playerStartPosition['soccer'].FW;
  const playersPositon = this.playersDefaultLength;
  let used_salary_cap = 0;
  this.selectedPlayersCount.All = this.lineupDetails.length;
  this.teamFull['All'] = (this.lineupDetails.length === this.default_total_players) ? 'full' : '';
  this.used_salary_cap = 0;
  const defP = [];
  const midP = [];
  const fwdP = [];
  let countDef = 0;
  let countMid = 0;
  let countFwd = 0;

console.log(this.lineupDetails);
  // this.selectedPlayersCount = { 'All': 0, 'WK': 0, 'BAT': 0, 'AR': 0, 'BOW': 0 };
 for (const player of  this.lineupDetails) {
  // let count = 0;
       const maxPlayers = this.playersMinMaxData[player.position]['max_player_per_position'];
       player.player_role_in_team = (player.player_role ==='1') ? 'captain' : ((player.player_role === '2') ? 'vice-captain' : '');

      // Condition for set players position in map for soccer
      if (this.sports_id === 5) {
        // console.log(this.datas.sports_id);
          if (player.position === 'GK') {
             this.fillKeeper(player);
              this.playersArr[0] = player;
              this.selectedPlayersCount.GK++;
              this.playerActive[0] = 'active';
              this.teamFull['GK'] = (this.selectedPlayersCount['GK'] === maxPlayers) ? 'full' : '';
          }

          if (player.position === 'DF') {
            if (this.formationSelected === '4-3-3') {
               if (!defP.includes(player.player_id) && countDef === 0) {
              // midP[player.player_id] = player;
              this.playerObj.fourThreeThree.def.def1 = player;
              defP.push(player.player_id);
              countDef = 1;
              // console.log(defP);
              // console.log(countDef);
            // defP[player.player_id] = player;
              } else if (!defP.includes(player.player_id) && countDef === 1) {
               // console.log(countDef);
                this.playerObj.fourThreeThree.def.def2 = player;
                defP.push(player.player_id);
                // defP[player.player_id] = player;
               // console.log(defP);
                countDef++;
              } else if (!defP.includes(player.player_id) && countDef === 2) {
                this.playerObj.fourThreeThree.def.def3 = player;
                defP.push(player.player_id);
               // defP[player.player_id] = player;
                countDef++;
              } else if (!defP.includes(player.player_id) && countDef === 3) {
                this.playerObj.fourThreeThree.def.def4 = player;
                defP.push(player.player_id);
               // defP[player.player_id] = player;
                countDef++;
              }
              // this.playerObj.fourThreeThree.gk = player;
             } else if (this.formationSelected === '5-4-1') {
              if (!defP.includes(player.player_id) && countDef === 0) {
                // midP[player.player_id] = player;
                this.playerObj.fiveFourOne.def.def1 = player;
                defP.push(player.player_id);
                countDef = 1;
               // console.log(defP);
                // console.log(countDef);
              // defP[player.player_id] = player;
                } else if (!defP.includes(player.player_id) && countDef === 1) {
                  console.log(countDef);
                  this.playerObj.fiveFourOne.def.def2 = player;
                  defP.push(player.player_id);
                  // defP[player.player_id] = player;
                  // console.log(defP);
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 2) {
                  this.playerObj.fiveFourOne.def.def3 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 3) {
                  this.playerObj.fiveFourOne.def.def4 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 4) {
                  this.playerObj.fiveFourOne.def.def5 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                }
              // this.playerObj.fiveFourOne.gk = player;
             } else if (this.formationSelected === '4-4-2') {
              if (!defP.includes(player.player_id) && countDef === 0) {
                // midP[player.player_id] = player;
                this.playerObj.fourFourTwo.def.def1 = player;
                defP.push(player.player_id);
                countDef = 1;
              // defP[player.player_id] = player;
                } else if (!defP.includes(player.player_id) && countDef === 1) {
                  console.log(countDef);
                  this.playerObj.fourFourTwo.def.def2 = player;
                  defP.push(player.player_id);
                  // defP[player.player_id] = player;
                  console.log(defP);
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 2) {
                  this.playerObj.fourFourTwo.def.def3 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 3) {
                  this.playerObj.fourFourTwo.def.def4 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                }
             // this.playerObj.fourFourTwo.gk = player;
             } else if (this.formationSelected === '4-5-1') {
              if (!defP.includes(player.player_id) && countDef === 0) {
                // midP[player.player_id] = player;
                this.playerObj.fourFiveOne.def.def1 = player;
                defP.push(player.player_id);
                countDef = 1;
                // console.log(defP);
                // console.log(countDef);
              // defP[player.player_id] = player;
                } else if (!defP.includes(player.player_id) && countDef === 1) {
                 // console.log(countDef);
                  this.playerObj.fourFiveOne.def.def2 = player;
                  defP.push(player.player_id);
                  // defP[player.player_id] = player;
                  // console.log(defP);
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 2) {
                  this.playerObj.fourFiveOne.def.def3 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 3) {
                  this.playerObj.fourFiveOne.def.def4 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                }
              // this.playerObj.fourFiveOne.gk = player;
             } else if (this.formationSelected === '5-3-2') {
              if (!defP.includes(player.player_id) && countDef === 0) {
                // midP[player.player_id] = player;
                this.playerObj.fiveThreeTwo.def.def1 = player;
                defP.push(player.player_id);
                countDef = 1;
                // console.log(defP);
                // console.log(countDef);
              // defP[player.player_id] = player;
                } else if (!defP.includes(player.player_id) && countDef === 1) {
                 // console.log(countDef);
                  this.playerObj.fiveThreeTwo.def.def2 = player;
                  defP.push(player.player_id);
                  // defP[player.player_id] = player;
                  // console.log(defP);
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 2) {
                  this.playerObj.fiveThreeTwo.def.def3 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 3) {
                  this.playerObj.fiveThreeTwo.def.def4 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 4) {
                  this.playerObj.fiveThreeTwo.def.def5 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                }
              // this.playerObj.fiveThreeTwo.gk = player;
             } else if (this.formationSelected === '3-5-2') {
              if (!defP.includes(player.player_id) && countDef === 0) {
                // midP[player.player_id] = player;
                this.playerObj.threeFiveTwo.def.def1 = player;
                defP.push(player.player_id);
                countDef = 1;
                // console.log(defP);
                // console.log(countDef);
              // defP[player.player_id] = player;
                } else if (!defP.includes(player.player_id) && countDef === 1) {
                 //  console.log(countDef);
                  this.playerObj.threeFiveTwo.def.def2 = player;
                  defP.push(player.player_id);
                  // defP[player.player_id] = player;
                  // console.log(defP);
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 2) {
                  this.playerObj.threeFiveTwo.def.def3 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                }
              // this.playerObj.threeFiveTwo.gk = player;
             } else if (this.formationSelected === '5-2-3') {
              if (!defP.includes(player.player_id) && countDef === 0) {
                // midP[player.player_id] = player;
                this.playerObj.fiveTwoThree.def.def1 = player;
                defP.push(player.player_id);
                countDef = 1;
                // console.log(defP);
                // console.log(countDef);
              // defP[player.player_id] = player;
                } else if (!defP.includes(player.player_id) && countDef === 1) {
                  // console.log(countDef);
                  this.playerObj.fiveTwoThree.def.def2 = player;
                  defP.push(player.player_id);
                  // defP[player.player_id] = player;
                  // console.log(defP);
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 2) {
                  this.playerObj.fiveTwoThree.def.def3 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 3) {
                  this.playerObj.fiveTwoThree.def.def4 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 4) {
                  this.playerObj.fiveTwoThree.def.def5 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                }
              // this.playerObj.fiveTwoThree.gk = player;
             }  else if (this.formationSelected === '3-4-3') {
              if (!defP.includes(player.player_id) && countDef === 0) {
                // midP[player.player_id] = player;
                this.playerObj.threeFourThree.def.def1 = player;
                defP.push(player.player_id);
                countDef = 1;
                // console.log(defP);
                // console.log(countDef);
              // defP[player.player_id] = player;
                } else if (!defP.includes(player.player_id) && countDef === 1) {
                  // console.log(countDef);
                  this.playerObj.threeFourThree.def.def2 = player;
                  defP.push(player.player_id);
                  // defP[player.player_id] = player;
                  // console.log(defP);
                  countDef++;
                } else if (!defP.includes(player.player_id) && countDef === 2) {
                  this.playerObj.threeFourThree.def.def3 = player;
                  defP.push(player.player_id);
                 // defP[player.player_id] = player;
                  countDef++;
                }
              // this.playerObj.fiveTwoThree.gk = player;
             }
              this.playersArr[dfPosition] = player;
              this.selectedPlayersCount.DF++;
              this.playerActive[dfPosition] = 'active';
              this.teamFull['DF'] = (this.selectedPlayersCount['DF'] === maxPlayers) ? 'full' : '';
              dfPosition++;
          }
          if (player.position === 'MF') {
            if (this.formationSelected === '4-3-3') {
              if (!midP.includes(player.player_id) && countMid === 0) {
              // defP[player.player_id] = player;
              this.playerObj.fourThreeThree.mid.mid1 = player;
              midP.push(player.player_id);
              countMid++;
              }
              if (!midP.includes(player.player_id) && countMid === 1) {
                this.playerObj.fourThreeThree.mid.mid2 = player;
                midP.push(player.player_id);
                countMid++;
              } else if (!midP.includes(player.player_id) && countMid === 2) {
                this.playerObj.fourThreeThree.mid.mid3 = player;
                midP.push(player.player_id);
                countMid++;
              }
              // this.playerObj.fourThreeThree.gk = player;
             } else if (this.formationSelected === '5-4-1') {
              if (!midP.includes(player.player_id) && countMid === 0) {
                // defP[player.player_id] = player;
                this.playerObj.fiveFourOne.mid.mid1 = player;
                midP.push(player.player_id);
                countMid++;
                }
                if (!midP.includes(player.player_id) && countMid === 1) {
                  this.playerObj.fiveFourOne.mid.mid2 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 2) {
                  this.playerObj.fiveFourOne.mid.mid3 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 3) {
                  this.playerObj.fiveFourOne.mid.mid4 = player;
                  midP.push(player.player_id);
                  countMid++;
                }
              // this.playerObj.fiveFourOne.gk = player;
             } else if (this.formationSelected === '4-4-2') {
              if (!midP.includes(player.player_id) && countMid === 0) {
                // defP[player.player_id] = player;
                this.playerObj.fourFourTwo.mid.mid1 = player;
                midP.push(player.player_id);
                countMid++;
                }
                if (!midP.includes(player.player_id) && countMid === 1) {
                  this.playerObj.fourFourTwo.mid.mid2 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 2) {
                  this.playerObj.fourFourTwo.mid.mid3 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 3) {
                  this.playerObj.fourFourTwo.mid.mid4 = player;
                  midP.push(player.player_id);
                  countMid++;
                }
             // this.playerObj.fourFourTwo.gk = player;
             } else if (this.formationSelected === '4-5-1') {
              if (!midP.includes(player.player_id) && countMid === 0) {
                // defP[player.player_id] = player;
                this.playerObj.fourFiveOne.mid.mid1 = player;
                midP.push(player.player_id);
                countMid++;
                }
                if (!midP.includes(player.player_id) && countMid === 1) {
                  this.playerObj.fourFiveOne.mid.mid2 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 2) {
                  this.playerObj.fourFiveOne.mid.mid3 = player;
                  midP.push(player.player_id);
                  countMid++;
                }  else if (!midP.includes(player.player_id) && countMid === 3) {
                  this.playerObj.fourFiveOne.mid.mid4 = player;
                  midP.push(player.player_id);
                  countMid++;
                }  else if (!midP.includes(player.player_id) && countMid === 4) {
                  this.playerObj.fourFiveOne.mid.mid5 = player;
                  midP.push(player.player_id);
                  countMid++;
                }
              // this.playerObj.fourFiveOne.gk = player;
             } else if (this.formationSelected === '5-3-2') {
              if (!midP.includes(player.player_id) && countMid === 0) {
                // defP[player.player_id] = player;
                this.playerObj.fiveThreeTwo.mid.mid1 = player;
                midP.push(player.player_id);
                countMid++;
                }
                if (!midP.includes(player.player_id) && countMid === 1) {
                  this.playerObj.fiveThreeTwo.mid.mid2 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 2) {
                  this.playerObj.fiveThreeTwo.mid.mid3 = player;
                  midP.push(player.player_id);
                  countMid++;
                }
              // this.playerObj.fiveThreeTwo.gk = player;
             } else if (this.formationSelected === '3-5-2') {
              if (!midP.includes(player.player_id) && countMid === 0) {
                // defP[player.player_id] = player;
                this.playerObj.threeFiveTwo.mid.mid1 = player;
                midP.push(player.player_id);
                countMid++;
                }
                if (!midP.includes(player.player_id) && countMid === 1) {
                  this.playerObj.threeFiveTwo.mid.mid2 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 2) {
                  this.playerObj.threeFiveTwo.mid.mid3 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 3) {
                  this.playerObj.threeFiveTwo.mid.mid4 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 4) {
                  this.playerObj.threeFiveTwo.mid.mid5 = player;
                  midP.push(player.player_id);
                  countMid++;
                }
              // this.playerObj.threeFiveTwo.gk = player;
             } else if (this.formationSelected === '5-2-3') {
              if (!midP.includes(player.player_id) && countMid === 0) {
                // defP[player.player_id] = player;
                this.playerObj.fiveTwoThree.mid.mid1 = player;
                midP.push(player.player_id);
                countMid++;
                }
                if (!midP.includes(player.player_id) && countMid === 1) {
                  this.playerObj.fiveTwoThree.mid.mid2 = player;
                  midP.push(player.player_id);
                  countMid++;
                }
              // this.playerObj.fiveTwoThree.gk = player;
             } else if (this.formationSelected === '3-4-3') {
              if (!midP.includes(player.player_id) && countMid === 0) {
                // defP[player.player_id] = player;
                this.playerObj.threeFourThree.mid.mid1 = player;
                midP.push(player.player_id);
                countMid++;
                }
                if (!midP.includes(player.player_id) && countMid === 1) {
                  this.playerObj.threeFourThree.mid.mid2 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 2) {
                  this.playerObj.threeFourThree.mid.mid3 = player;
                  midP.push(player.player_id);
                  countMid++;
                } else if (!midP.includes(player.player_id) && countMid === 3) {
                  this.playerObj.threeFourThree.mid.mid4 = player;
                  midP.push(player.player_id);
                  countMid++;
                }
             }
              this.playersArr[mfPosition] = player;
              this.selectedPlayersCount.MF++;
              this.playerActive[mfPosition] = 'active';
              this.teamFull['MF'] = (this.selectedPlayersCount['MF'] === maxPlayers) ? 'full' : '';
              mfPosition++;
          }
          if (player.position === 'FW') {
            if (this.formationSelected === '4-3-3') {
             if (!fwdP.includes(player.player_id) && countFwd === 0) {
              fwdP.push(player.player_id);
              // defP[player.player_id] = player;
              this.playerObj.fourThreeThree.fwd.fwd1 = player;
              countFwd++;
               }
              if (!fwdP.includes(player.player_id) && countFwd === 1) {
                this.playerObj.fourThreeThree.fwd.fwd2 = player;
                fwdP.push(player.player_id);
                countFwd++;
              } else if (!fwdP.includes(player.player_id) && countFwd === 2) {
                this.playerObj.fourThreeThree.fwd.fwd3 = player;
                fwdP.push(player.player_id);
                countFwd++;
              }
              // this.playerObj.fourThreeThree.gk = player;
             } else if (this.formationSelected === '5-4-1') {
              if (!fwdP.includes(player.player_id) && countFwd === 0) {
                fwdP.push(player.player_id);
                // defP[player.player_id] = player;
                this.playerObj.fiveFourOne.fwd.fwd1 = player;
                countFwd++;
                 }
              // this.playerObj.fiveFourOne.gk = player;
             } else if (this.formationSelected === '4-4-2') {
              if (!fwdP.includes(player.player_id) && countFwd === 0) {
                fwdP.push(player.player_id);
                // defP[player.player_id] = player;
                this.playerObj.fourFourTwo.fwd.fwd1 = player;
                countFwd++;
                 }
                if (!fwdP.includes(player.player_id) && countFwd === 1) {
                  this.playerObj.fourFourTwo.fwd.fwd2 = player;
                  fwdP.push(player.player_id);
                  countFwd++;
                }
             // this.playerObj.fourFourTwo.gk = player;
             } else if (this.formationSelected === '4-5-1') {
              if (!fwdP.includes(player.player_id) && countFwd === 0) {
                fwdP.push(player.player_id);
                // defP[player.player_id] = player;
                this.playerObj.fourFiveOne.fwd.fwd1 = player;
                countFwd++;
                 }
              // this.playerObj.fourFiveOne.gk = player;
             } else if (this.formationSelected === '5-3-2') {
              if (!fwdP.includes(player.player_id) && countFwd === 0) {
                fwdP.push(player.player_id);
                // defP[player.player_id] = player;
                this.playerObj.fiveThreeTwo.fwd.fwd1 = player;
                countFwd++;
                 }
                if (!fwdP.includes(player.player_id) && countFwd === 1) {
                  this.playerObj.fiveThreeTwo.fwd.fwd2 = player;
                  fwdP.push(player.player_id);
                  countFwd++;
                }
              // this.playerObj.fiveThreeTwo.gk = player;
             } else if (this.formationSelected === '3-5-2') {
              if (!fwdP.includes(player.player_id) && countFwd === 0) {
                fwdP.push(player.player_id);
                // defP[player.player_id] = player;
                this.playerObj.threeFiveTwo.fwd.fwd1 = player;
                countFwd++;
                 }
                if (!fwdP.includes(player.player_id) && countFwd === 1) {
                  this.playerObj.threeFiveTwo.fwd.fwd2 = player;
                  fwdP.push(player.player_id);
                  countFwd++;
                }
              // this.playerObj.threeFiveTwo.gk = player;
             } else if (this.formationSelected === '5-2-3') {
              if (!fwdP.includes(player.player_id) && countFwd === 0) {
                fwdP.push(player.player_id);
                // defP[player.player_id] = player;
                this.playerObj.fiveTwoThree.fwd.fwd1 = player;
                countFwd++;
                 }
                if (!fwdP.includes(player.player_id) && countFwd === 1) {
                  this.playerObj.fiveTwoThree.fwd.fwd2 = player;
                  fwdP.push(player.player_id);
                  countFwd++;
                } else if (!fwdP.includes(player.player_id) && countFwd === 2) {
                  this.playerObj.fiveTwoThree.fwd.fwd3 = player;
                  fwdP.push(player.player_id);
                  countFwd++;
                }
              // this.playerObj.fiveTwoThree.gk = player;
             } else if (this.formationSelected === '3-4-3') {
              if (!fwdP.includes(player.player_id) && countFwd === 0) {
                fwdP.push(player.player_id);
                // defP[player.player_id] = player;
                this.playerObj.threeFourThree.fwd.fwd1 = player;
                countFwd++;
                 } else if (!fwdP.includes(player.player_id) && countFwd === 1) {
                  this.playerObj.threeFourThree.fwd.fwd2 = player;
                  fwdP.push(player.player_id);
                  countFwd++;
                } else if (!fwdP.includes(player.player_id) && countFwd === 2) {
                  this.playerObj.threeFourThree.fwd.fwd3 = player;
                  fwdP.push(player.player_id);
                  countFwd++;
                }
             }
              this.playersArr[fwPosition] = player;
              this.selectedPlayersCount.FW++;
              this.playerActive[fwPosition] = 'active';
              this.teamFull['FW'] = (this.selectedPlayersCount['FW'] === maxPlayers) ? 'full' : '';
              fwPosition++;
          }
      }

      this.captainObj.captain = (player.player_role === '1') ? player.player_id : this.captainObj.captain;
        this.captainObj.viceCaptain = (player.player_role === '2') ? player.player_id : this.captainObj.viceCaptain;

      this.finalSelectedPlayersArr.push(player);
      used_salary_cap += parseFloat(player.salary);
      // for autofill use
      this.selectedPlayerData.push(player);
  }
  console.log(this.captainObj);
  console.log(this.selectedPlayerData);
  console.log(this.finalSelectedPlayersArr);
  this.setPlayersAddBtnStatus(); // Set players add remove button status
  this.getAllRosters();

  this.calculateSalaryCap(used_salary_cap, 'editOnload'); // Calculate salary cap

}
getAutoPickData = function() {
this.isLoading = true;
 // if add lineup and all players are selected then blank selected players for random records.
  if (this.lineupPage === 'add' && this.selectedPlayerData.length === 11) {
            this.selectedPlayerData = [];
  }

  this.lineupDetails = [];
  this.loadPlayers   = true;
  this.posting       = true;

  const reqParams = {
    'sports_id'             : this.datas.sports_id,
    'league_id'             : this.datas.league_id,
    'collection_master_id'  : this.datas.collection_master_id,
    'selectedPlayerData'    : this.selectedPlayerData,
    'lineup_master_id'      : this.datas.lineup_master_id,
    'formation'             : this.formationSelected
  };
  this.service.api('fantasy/cricket_lineup/lineup/get_autofill_lineup_data', reqParams, 'post', this.session)
  .subscribe( (response) => {
  if (response.response_code === 200) {
  // console.log(this.selectedPlayerData);
  // console.log(response);
  this.lineupDetails = response.data.lineup_player;
  const used_salary_cap = response.data.lineup_salary;
  this.loadPlayers = false;
  this.isLoading = false;
  // console.log(this.lineupDetails);

 if (!this.lineupDetails.length) {
    // this.lineupPage = 'add';
  }
  this.isEditMode = false;
  this.fillPlayGround();
// calculateSalaryCap(used_salary_cap, "add");
 }
},  error => {
  if (error['error']['global_error'] === 'Session key has expired') {
    this.message = error['error']['global_error'];
    this.router.navigate(['/']);
  }
}
);
};
autoDeletePlayers(arg?, playerId?) {
  for (const formation in this.playerObj) {
    if (this.playerObj.hasOwnProperty(formation)) {
       for (const f in this.playerObj[formation]) {
        if (this.playerObj[formation].hasOwnProperty(f)) {
          for ( const m in this.playerObj[formation][f]) {
            if (this.playerObj.hasOwnProperty(formation)) {
              if (arg === 'list') {
                if ( this.playerObj[formation][f][m].player_id === playerId) {
                  console.log( this.playerObj[formation][f][m].player_id, playerId);
                  this.playerObj[formation][f][m] = {};
                }
              } else {
                this.playerObj[formation][f][m] = {};

              }
            }
          }
          }
       }
   }
 }
}
getCollectionDetail() {
  // this.collection_detail = {};
  const param = {
      'collection_master_id': this.datas.collection_master_id,
      'sports_id': this.sports_id
  };
  this.service.api('fantasy/lobby/get_collection_detail', param, 'POST', this.session)
   .subscribe((response: Response) => {
     console.log(response);
      if (response['response_code'] === 200) {
          // Check match available or not
          if (!response['data'].match_list.length) {
              alert('Matches not available.');
             // $state.go('root.lobby.init');
              return false;
          }

          this.collection_detail = response['data'].collection;
          this.collection_detail['season_scheduled_date'] = response['data'].match_list[0].season_scheduled_date;
          this.collection_detail['today'] = response['data'].match_list[0].today;
          this.collection_detail['match_list'] = response['data'].match_list;
          console.log( this.collection_detail['match_list']);
          console.log( this.collection_detail);
           this.getLineupMasterData();
            this.getAllTeams();
          this.playerservice.setPlayersPosition();
      }
  },  (error: Error) => {
      if (error['error']['global_error'] === 'Session key has expired') {
        this.message = error['error']['global_error'];
        this.router.navigate(['/']);
      }
     // $state.go('root.lobby.init');
  });
}
getLineupMasterData() {
  this.isLoading = true;
  this.masterLineupData = [];
  const reqParams = {
      'league_id': this.datas.league_id,
      'sports_id': this.sports_id,
      'collection_master_id': this.datas.collection_master_id,
      'lineup_master_id': ''
  };

  // Condition for edit lineup
  if (this.lineupPage === 'edit') {
      reqParams.lineup_master_id = this.lineup_master_id;
  }
  this.service.api('fantasy/cricket_lineup/lineup/get_lineup_master_data', reqParams, 'POST', this.session)
  .subscribe( (response: Response) => {
      if (response['response_code'] === 200) {
          // console.warn(reqParams);
          // console.warn(response);
          this.masterLineupData = response['data'].all_position;
          // console.warn( this.masterLineupData);
          this.salary_cap = response['data'].salary_cap;
          this.remaining_salary_cap = response['data'].salary_cap;
          this.captainObj.team_name = response['data'].team_name;
          for (const obj of this.masterLineupData) {
              this.defaultTeam[obj.position] = '';
              if (obj.position !== 'All') {
                  this.playersMinMaxData[obj.position] = obj;
              } else {
                  this.defaultTeam[obj.position] = 'active';
              }
          }

           this.league_detail = response['data'].league_data;
          /* Check lineup master id is exist or not for lineup edit */
          if (this.lineupPage === 'edit') {
           // this.fillPlayGround();
               this.getUsersLineUp();
          } // else {
            this.getAllRosters();
          // }
      }

  }, (error: Error) => {
      if (error['error']['global_error'] === 'Session key has expired') {
        this.message = error['error']['global_error'];
        this.router.navigate(['/']);
      }
  });
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
getUsersLineUp() {
  this.setPlayersPosition();
  this.setPlayersCount();
  this.lineupDetails = [];
  this.loadPlayers = true;
  this.posting = true;
  const reqParams = {
      'lineup_master_id': this.lineup_master_id,
      'collection_master_id': this.datas.collection_master_id,
      'league_id': this.datas.league_id,
  };
  this.service.api('fantasy/cricket_lineup/lineup/get_user_lineup', reqParams, 'POST', this.session)
  .subscribe((response) => {
      if (response.response_code === 200) {
        this.isLoading = false;
          this.lineupDetails = response.data.lineup;
          this.captainObj.team_name = response.data.team_name;
          this.loadPlayers = false;
           console.log(response.data );
          if (!this.lineupDetails.length) {
              this.lineupPage = 'add';
          }

          this.isEditMode = true;
          this.fillPlayGround();
      }
  },  (error: Error) => {

      this.loadPlayers = false;
        if (error['error']['global_error'] === 'Session key has expired') {
          this.message = error['error']['global_error'];
          this.router.navigate(['/']);
        }
     // $state.go('root.lobby.init');
  });
}
getAllTeams() {
  this.allLeaguelist = [];
  const reqParams = {
      'league_id': this.datas.league_id,
      'sports_id': this.sports_id,
      'collection_master_id': this.datas.collection_master_id
  };
  this.service.api('fantasy/cricket_lineup/lineup/get_all_team', reqParams, 'POST', this.session)
  .subscribe( (response: Response) => {
      if (response['response_code'] === 200) {
          this.allTeamslist = response['data'].result;
      }
  }, (error) => {
    if (error['error']['global_error'] === 'Session key has expired') {
      this.message = error['error']['global_error'];
      this.router.navigate(['/']);
    }
  });
}
captainSelector() {
  this.lineupSubmitBtn = true;
  // console.log(this.captain.nativeElement.value,
     // this.viceCaptain.nativeElement.value, this.team_name.nativeElement.value);
  const captainObj = {
    'captain': this.captain.nativeElement.value,
    'viceCaptain': this.viceCaptain.nativeElement.value,
    'team_name': this.team_name.nativeElement.value
  };
  this.captainObj = captainObj;
  // console.log(this.captainshipForm);
 // this.captainObj = captainObj;
 console.log(captainObj);
  this.playersData = [];
  // console.log(captainObj);
  // alert('stopped');
  //  this.lineupPage ;
  // this.selectedCollection = selectedCollection;
  // this.collection_detail = collection_detail;
  const currentUser = this.utilityService.getLocalStorage('user');
  if (!(captainObj.team_name.indexOf(currentUser['data']['user_profile'].user_name) >= 0)) {
      this.captainObj.team_name = currentUser['data']['user_profile'].user_name + ' ' + captainObj.team_name;
    console.log(this.captainObj);
    }
  this.is_disable_selection = false;
 // console.log("selected collection",this.collection_detail);
  if (this.collection_detail && this.collection_detail.contest_live_status === 'Live') {
      this.is_disable_selection = true;
  }

  if (this.lineupPage === 'edit') {
      // Condition for check previous selected captain and vice captain exist or not
      const checkViceCaptainExist = this.utilityService.filterArr(this.finalSelectedPlayersArr, 'player_id', this.captainObj.viceCaptain),
      checkCaptainExist = this.utilityService.filterArr(this.finalSelectedPlayersArr, 'player_id', this.captainObj.captain);
      this.captainObj.captain = (checkCaptainExist.length) ? this.captainObj.captain : '';
      this.captainObj.viceCaptain = (checkViceCaptainExist.length) ? this.captainObj.viceCaptain : '';
  }
  /* Players final team create array */
   const team_data = this.filterPlayers();

  this.submitLineUp( team_data);
}
submitLineUp(formValidation) {
      if (this.captainObj.captain === this.captainObj.viceCaptain) {
          // tslint:disable-next-line:quotemark
          alert("Your Captain and vice-captain can't be same");
          return false;
      } else {
        this.selectCaptain.hide();
          const reqParams = formValidation; // this.filterPlayers();
          reqParams.team_name = this.captainObj.team_name;
          // console.log( reqParams);
          if (this.lineupPage === 'edit') {

              this.lineupSubmitBtn = true;
              reqParams.lineup_master_id = this.lineup_master_id;
              this.service.api('fantasy/cricket_lineup/lineup/lineup_proccess', reqParams, 'POST', this.session).
              subscribe( (response) => {
                  if (response.response_code === 200) {
                    this.isPosting = false;
                      alert(response.message);
                      this.router.navigate([this.sports_id + '/my-league/upcoming']);
                      // $uibModalInstance.dismiss('cancel');
                      if (typeof response.data.is_joined_contest !== 'undefined' && response.data.is_joined_contest === 1) {
                        this.router.navigate([this.sports_id + '/my-league/upcoming']);
                        // $state.go('root.league.init', {sports_id: this.sports_id, 'current_tab': 0 });
                      } else {
                        this.router.navigate( [this.sports_id + '/lobby']);
                         // $state.go('root.lobby.init', { sports_id: this.state_params.sports_id });
                      }
                  }
                  this.lineupSubmitBtn = false;
              },  (error) => {
                  this.lineupSubmitBtn = false;
                 // $uibModalInstance.dismiss('cancel');
                 if (error['error']['global_error'] === 'Session key has expired') {
                  this.message = error['error']['global_error'];
                  this.router.navigate(['/']);
                }
              });

          } else {

              // console.log(teamData);
              // return false;
              this.lineupSubmitBtn = true;
              this.service.api('fantasy/cricket_lineup/lineup/lineup_proccess', reqParams, 'POST', this.session)
              .subscribe((response) => {
                this.isPosting = false;

                  if (response.response_code === 200) {
                      // alert(response.message);
                      this.joinGameModals(this.contest, 'lineup', this.myLineupList, 'isTurbo');
                      // this.confirmJoinContest();
                      // this.router.navigate(['/' + this.datas.sports_id + '/' + this.datas.league_id + '/my-league']);
                  }
                  this.lineupSubmitBtn = false;
              }, (error) => {
                  this.lineupSubmitBtn = false;
                 //  $uibModalInstance.dismiss('cancel');
                  if (error['error']['global_error'] === 'Session key has expired') {
                    this.message = error['error']['global_error'];
                    this.router.navigate(['/']);
                  }
              });
          }
      }

  // }
}
confirmJoinContest(lineup?) {
   this.joinGameConfirmModal.hide();
  // this.modalservice.showJoinConfirm('hide');
  const param = {
  'contest_id': this.contest.contest_id,
  'lineup_master_id': this.confirmJoinForm.value.lineup,
  'promo_code': this.confirmJoinForm.value.lineup.promo_code
  };
console.log(this.confirmJoinForm.value.lineup[0], param);

this.service.api('fantasy/contest/join_game', param, 'POST', this.session)
.subscribe((response) => {
  console.warn(response);
  const idx = this.contestList.indexOf(this.joinGameInitObj.contest);
  this.joinGameInitObj.contest.total_user_joined = Number(this.joinGameInitObj.contest.total_user_joined) + 1;
  this.joinGameInitObj.contest.user_joined_count = Number(this.joinGameInitObj.contest.user_joined_count) + 1;
  if (idx > -1 && (this.joinGameInitObj.contest.multiple_lineup === 0)) {
      this.contestList.splice(idx, 1);
      this.joinGameInitObj.contest.isJoind = true;
  }

  if (idx > -1 && (this.joinGameInitObj.contest.multiple_lineup > 0)
  && this.joinGameInitObj.contest.size === this.joinGameInitObj.contest.total_user_joined) {
      this.contestList.splice(idx, 1);
  }
  // Increase user join count for button change
  if (this.contestList[idx]) {
      this.contestList[idx].user_joined_count++;
  }
 // $rootScope.$emit('user:balance', this.currentUser.user_id);

  // Condition for featured game plus button show
  if (this.joinGameInitObj.contest.is_feature === 1) {
      const featuredConIndex = this.featuredContestList.indexOf(this.joinGameInitObj.contest);
      this.featuredContestList[featuredConIndex].user_joined_count++;
      this.featuredContestList[featuredConIndex].total_user_joined+1;
  }
  alert(response.message);
  this.router.navigate(['/' + this.datas.sports_id + '/' + this.datas.league_id + '/my-league']);
 //  $rootScope.joinContestSuccessModalInit(response.message); //Success modal init

}, (error) => {
 // emitAlert.on(error.global_error, 'danger');
 alert(error.error['global_error']);
  console.log(error);
});
}
filterPlayers() {
   this.playersData = [];
   for (let i = 0; i < this.finalSelectedPlayersArr.length; i++) {
     const key = i;
     const obj = this.finalSelectedPlayersArr[i];
   // console.log('index:', i, 'element:', this.finalSelectedPlayersArr[i]);
   this.playersData.push({
    player_id: obj.player_id,
    player_uid: obj.player_uid,
    player_team_id: obj.player_team_id,
    position: obj.position,
    salary: obj.salary,
    team_league_id: obj.team_league_id,
    player_role: '0'
});

 if (obj.player_id === this.captainObj.captain || obj.player_id === this.captainObj.viceCaptain) {
    this.playersData[key].player_role = (obj.player_id === this.captainObj.captain) ? '1' : '2';
    // console.log(this.playersData[key].player_role);
} else {
  this.playersData[key].player_role = '0';
}
}
  const playersData = {
    'league_id': this.datas.league_id,
    'sports_id': this.datas.sports_id,
    'collection_master_id': this.datas.collection_master_id,
    'lineup': this.playersData,
    'team_name': '',
    'lineup_master_id': ''
};
console.log(playersData);
 return playersData;
  }
  playerRemover (playerId, playerType, removeFrom, formationtype?) {
     if (removeFrom === 'map') {
    if (this.formationSelected === '4-3-3') {
      console.log(formationtype);
      if (playerType === 'GK') {
       this.playerObj.fourThreeThree.gk.gk1 = {} as Player;
       // this.goalkeepersArray = [];
      } else if (playerType === 'DF') {
     if (formationtype === 'def1') {
       this.playerObj.fourThreeThree.def.def1 = {} as Player;
     } else if (formationtype === 'def2') {
       this.playerObj.fourThreeThree.def.def2 = {} as Player;
     } else if (formationtype === 'def3') {
       this.playerObj.fourThreeThree.def.def3 = {} as Player;
     } else if (formationtype === 'def4') {
       this.playerObj.fourThreeThree.def.def4 = {} as Player;
      // }
    }

    } else if (playerType === 'MF') {
     if (formationtype === 'mf1') {
       this.playerObj.fourThreeThree.mid.mid1 = {} as Player;
     } else if (formationtype === 'mf2') {
       this.playerObj.fourThreeThree.mid.mid2 = {} as Player;
     } else if (formationtype === 'mf3') {
       this.playerObj.fourThreeThree.mid.mid3 = {} as Player;
     }
   } else if (playerType === 'FW') {
    if (formationtype === 'fwd1') {
      this.playerObj.fourThreeThree.fwd.fwd1 = {} as Player;
    } else if (formationtype === 'fwd2') {
      this.playerObj.fourThreeThree.fwd.fwd2 = {} as Player;
    } else if (formationtype === 'fwd3') {
      console.log(formationtype);
      this.playerObj.fourThreeThree.fwd.fwd3 = {} as Player;
    }
  }
  }
  } else {
    if (removeFrom === 'list') {
      console.log(removeFrom);
     this.autoDeletePlayers('list', playerId);
     }
  }
 }
  playerStatusCheck (playerId, playerIndex, playerPosition, playerType, maxPlayers) {

  const salary = parseFloat(this.allRosterslist[playerIndex].salary);
  // if (playerType === 'DF') {
   // if (this.formationSelected === '4-3-3') {
     // if (this.defLi === 'def1') {
     this.playersArr[playerPosition] = this.allRosterslist[playerIndex];
      this.playerActive[playerPosition] = true;
      // this.playerLiDom(this.playersArr[playerPosition]);
      // console.log( this.playersArr[allow_substitution]);
     // this.pArray(this.playersArr[playerPosition]);
     // this.playerLiDom(this.playersArr[playerPosition]);
      this.btnAddRoster[playerId] = true;
      this.btnRemoveRoster[playerId] = true;
      this.selectedPlayerData.push(this.allRosterslist[playerIndex]);
     // this.pArray(this.playersArr[playerPosition]);
      // console.log( this.selectedPlayerData);
      // console.log( maxPlayers );
      this.countSelectedPlayers();
      this.calculateSalaryCap(salary, 'add'); // Calculate remainig amount
      this.teamFull[playerType] = (this.selectedPlayersCount[playerType] === maxPlayers) ? 'full' : '';
      this.teamFull['All'] = (this.selectedPlayersCount['All'] === this.default_total_players) ? 'full' : '';
      this.defLi = '';
      // this.playerList.hide();
     // this.playerObj.fourThreeThree.def.def1 = this.playersArr[playerPosition];
     // }
   // }
 // }

 }
 iteratePlayerObj (playerObj) {
    for (const pos in playerObj) {
      if (playerObj.hasOwnProperty(pos)) {
         console.log(pos);
      }
   }
 }
 removeItemFromArray(playerId, selectedPlayerIndex) {
  if (this.defendersArray.includes(playerId)){
    const index = this.defendersArray.indexOf(playerId);
    this.defendersArray.splice(index, 1);
    console.log(this.defendersArray);
    // this.defendersArray[index] = '';
    // alert( 'from removeItem' + this.defendersArray.length);
  } else if (this.midfieldersArray.includes(playerId)){
    const index = this.midfieldersArray.indexOf(playerId);
    this.midfieldersArray.splice(index, 1);
    // this.midfieldersArray[index] = '';
   // alert( 'from removeItem' + this.midfieldersArray.length);
  } else if (this.forwardsArray.includes(playerId)){
   /* return this.forwardsArray.filter((ele) => {
      return ele !== playerId;
  });*/
  const index = this.forwardsArray.indexOf(playerId);
    this.forwardsArray.splice(index, 1);

} else {
    const index = this.goalkeepersArray.indexOf(playerId);
    this.goalkeepersArray.splice(index, 1);
  }
 }
 onPlayerListSelectFirst(player, playerIndex, playerPosition, playerType, maxPlayers) {
  for (const formation in this.playerObj) {
    if (formation === 'fourThreeThree') {
      for (const position in this.playerObj[formation]) {
        if (position === 'def' && player.position === 'DF') {
          for (const def in this.playerObj[formation][position]) {
            if ( this.playerObj[formation][position].hasOwnProperty(def) ) {
               if (typeof this.playerObj[formation][position][def] === 'object') {
                 if (Object.entries(this.playerObj[formation][position][def]).length === 0){
                     console.log('inside 00000000000');
                  if ( this.defendersArray.length < 4) {
                    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
                  this.playerObj[formation][position][def] = player;
                  this.defendersArray.push(player.player_id);
                  console.log(this.defendersArray);
                   if (this.deviceService.isMobile()){
                    if (this.defendersArray.length === 4) {
                      this.playerList.hide();
                     }
                      break;
                     } else {
                       break;
                     }
                  } else {
                    if (!this.deviceService.isDesktop()) {
                      if (this.defendersArray.length === 4) {
                        alert('Maximum number of defenders has been reached');
                         }
                    }
                    break;
                  }

               }
               // break;
              // console.log(this.playerObj[formation][position][def]);
            }
          }
        }
      } else  if (position === 'mid' && player.position === 'MF') {
         for (const mid in this.playerObj[formation][position]) {
           if ( this.playerObj[formation][position].hasOwnProperty(mid) ) {
              if (typeof this.playerObj[formation][position][mid] === 'object') {
                // this.playerObj[formation][position][mid] = player;
                if (Object.entries(this.playerObj[formation][position][mid]).length===0){
                  if ( this.midfieldersArray.length < 3) {
                    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
                  this.playerObj[formation][position][mid] = player;
                  this.midfieldersArray.push(player.player_id);
                  console.log(this.midfieldersArray);
                   if (this.deviceService.isMobile()){
                    if (this.midfieldersArray.length === 3) {
                      this.playerList.hide();
                     }
                      break;
                     } else {
                       break;
                     }
                  } else {
                    if (!this.deviceService.isDesktop()) {
                      if (this.midfieldersArray.length === 3) {
                        alert('Maximum number of midfielders has been reached');
                         }
                    }
                    break;
                  }
                }
              }
             // console.log(this.playerObj[formation][position][def]);
           }
         }
       } else  if (position === 'fwd' && player.position === 'FW') {
         for (const fwd in this.playerObj[formation][position]) {
           if ( this.playerObj[formation][position].hasOwnProperty(fwd) ) {
              if (typeof this.playerObj[formation][position][fwd] === 'object') {
                // this.playerObj[formation][position][fwd] = player;
                if (Object.entries(this.playerObj[formation][position][fwd]).length===0){
                  if ( this.forwardsArray.length < 3) {
                    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
                  this.playerObj[formation][position][fwd] = player;
                  this.forwardsArray.push(player.player_id);
                  console.log(this.forwardsArray);
                   if (this.deviceService.isMobile()){
                    if (this.forwardsArray.length === 3) {
                      this.playerList.hide();
                     }
                      break;
                     } else {
                       break;
                     }
                  } else {
                    if (!this.deviceService.isDesktop()) {
                      if (this.forwardsArray.length === 3) {
                        alert('Maximum number of midfielders has been reached');
                         }
                    }
                    break;
                  }
                }
              }
             // console.log(this.playerObj[formation][position][def]);
           }
         }
       } else  if (position === 'gk' && player.position === 'GK') {
         for (const gk in this.playerObj[formation][position]) {
           if ( this.playerObj[formation][position].hasOwnProperty(gk) ) {
              if (typeof this.playerObj[formation][position][gk] === 'object') {
                // this.playerObj[formation][position][gk] = player;
                if (Object.entries(this.playerObj[formation][position][gk]).length===0){
                  console.log('keepers00000000000000000000000000000');
                  if ( this.goalkeepersArray.length < 1) {
                    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
                  this.playerObj[formation][position][gk] = player;
                  this.goalkeepersArray.push(player.player_id);
                  console.log(this.goalkeepersArray);
                   if (this.deviceService.isMobile()){
                    if (this.goalkeepersArray.length === 1) {
                      this.playerList.hide();
                     }
                      break;
                     } else {
                       break;
                     }
                  } else {
                    if (!this.deviceService.isDesktop()) {
                      if (this.goalkeepersArray.length === 1) {
                        alert('Maximum number of midfielders has been reached');
                         }
                    }
                    break;
                  }
                }
              }
             console.log(this.playerObj[formation][position][gk]);
           }
         }
       }
      }
     // return false;
    }  /* else if(formation === 'threeFourThree') {
      for (const position in this.playerObj[formation]) {
        if (position === 'def' && player.position === 'DF') {
          for (const def in this.playerObj[formation][position]) {
            if ( this.playerObj[formation][position].hasOwnProperty(def) ) {
               if (typeof this.playerObj[formation][position][def] === 'object') {
                 if (Object.entries(this.playerObj[formation][position][def]).length === 0){
                     console.log('inside 00000000000');
                  if ( this.defendersArray.length < 3) {
                    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
                  this.playerObj[formation][position][def] = player;
                  this.defendersArray.push(player.player_id);
                  console.log(this.defendersArray);
                   if (this.deviceService.isMobile()){
                    if (this.defendersArray.length === 3) {
                      this.playerList.hide();
                     }
                      break;
                     } else {
                       break;
                     }
                  } else {
                    if (!this.deviceService.isDesktop()) {
                      if (this.defendersArray.length === 3) {
                        alert('Maximum number of defenders has been reached');
                         }
                    }
                    break;
                  }

               }
               // break;
              // console.log(this.playerObj[formation][position][def]);
            }
          }
        }
      } else  if (position === 'mid' && player.position === 'MF') {
         for (const mid in this.playerObj[formation][position]) {
           if ( this.playerObj[formation][position].hasOwnProperty(mid) ) {
              if (typeof this.playerObj[formation][position][mid] === 'object') {
                // this.playerObj[formation][position][mid] = player;
                if (Object.entries(this.playerObj[formation][position][mid]).length===0){
                  if ( this.midfieldersArray.length < 4) {
                    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
                  this.playerObj[formation][position][mid] = player;
                  this.midfieldersArray.push(player.player_id);
                  console.log(this.midfieldersArray);
                   if (this.deviceService.isMobile()){
                    if (this.midfieldersArray.length === 4) {
                      this.playerList.hide();
                     }
                      break;
                     } else {
                       break;
                     }
                  } else {
                    if (!this.deviceService.isDesktop()) {
                      if (this.midfieldersArray.length === 4) {
                        alert('Maximum number of midfielders has been reached');
                         }
                    }
                    break;
                  }
                }
              }
             // console.log(this.playerObj[formation][position][def]);
           }
         }
       } else  if (position === 'fwd' && player.position === 'FW') {
         for (const fwd in this.playerObj[formation][position]) {
           if ( this.playerObj[formation][position].hasOwnProperty(fwd) ) {
              if (typeof this.playerObj[formation][position][fwd] === 'object') {
                // this.playerObj[formation][position][fwd] = player;
                if (Object.entries(this.playerObj[formation][position][fwd]).length===0){
                  if ( this.forwardsArray.length < 3) {
                    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
                  this.playerObj[formation][position][fwd] = player;
                  this.forwardsArray.push(player.player_id);
                  console.log(this.forwardsArray);
                   if (this.deviceService.isMobile()){
                    if (this.forwardsArray.length === 3) {
                      this.playerList.hide();
                     }
                      break;
                     } else {
                       break;
                     }
                  } else {
                    if (!this.deviceService.isDesktop()) {
                      if (this.forwardsArray.length === 3) {
                        alert('Maximum number of midfielders has been reached');
                         }
                    }
                    break;
                  }
                }
              }
             // console.log(this.playerObj[formation][position][def]);
           }
         }
       } else  if (position === 'gk' && player.position === 'GK') {
         for (const gk in this.playerObj[formation][position]) {
           if ( this.playerObj[formation][position].hasOwnProperty(gk) ) {
              if (typeof this.playerObj[formation][position][gk] === 'object') {
                // this.playerObj[formation][position][gk] = player;
                if (Object.entries(this.playerObj[formation][position][gk]).length===0){
                  console.log('keepers00000000000000000000000000000');
                  if ( this.goalkeepersArray.length < 1) {
                    this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
                  this.playerObj[formation][position][gk] = player;
                  this.goalkeepersArray.push(player.player_id);
                  console.log(this.goalkeepersArray);
                   if (this.deviceService.isMobile()){
                    if (this.goalkeepersArray.length === 1) {
                      this.playerList.hide();
                     }
                      break;
                     } else {
                       break;
                     }
                  } else {
                    if (!this.deviceService.isDesktop()) {
                      if (this.goalkeepersArray.length === 1) {
                        alert('Maximum number of midfielders has been reached');
                         }
                    }
                    break;
                  }
                }
              }
             console.log(this.playerObj[formation][position][gk]);
           }
         }
       }
      }
     // return false;
    }  else if (formation === 'fourFiveOne') {
  for (const position in this.playerObj[formation]) {
    if (position === 'def' && player.position === 'DF') {
      for (const def in this.playerObj[formation][position]) {
        if ( this.playerObj[formation][position].hasOwnProperty(def) ) {
           if (typeof this.playerObj[formation][position][def] === 'object') {
             // this.playerObj[formation][position][def] = player;
             if (Object.entries(this.playerObj[formation][position][def]).length===0){
               this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
               this.playerObj[formation][position][def] = player;
               this.defendersArray.push(player.player_id);
               if (this.defendersArray.length === 4) {
                 this.playerList.hide();
               }
               break;
             }
           }
          // console.log(this.playerObj[formation][position][def]);
        }
      }
    } else  if (position === 'mid' && player.position ==='MF') {
     for (const mid in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(mid) ) {
          if (typeof this.playerObj[formation][position][mid] === 'object') {
            // this.playerObj[formation][position][mid] = player;
            if (Object.entries(this.playerObj[formation][position][mid]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][mid] = player;
              this.midfieldersArray.push(player.player_id);
              if (this.midfieldersArray.length === 5) {
               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'fwd' && player.position ==='FW') {
     for (const fwd in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(fwd) ) {
          if (typeof this.playerObj[formation][position][fwd] === 'object') {
            // this.playerObj[formation][position][fwd] = player;
            if (Object.entries(this.playerObj[formation][position][fwd]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][fwd] = player;
              this.forwardsArray.push(player.player_id);
              if (this.forwardsArray.length === 1) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'gk' && player.position ==='GK') {
     for (const gk in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(gk) ) {
          if (typeof this.playerObj[formation][position][gk] === 'object') {
            // this.playerObj[formation][position][gk] = player;
            if (Object.entries(this.playerObj[formation][position][gk]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][gk] = player;
              this.goalkeepersArray.push(player.player_id);
              if (this.goalkeepersArray.length === 1) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   }
  }
} else if (formation === 'fourFourTwo') {
  for (const position in this.playerObj[formation]) {
    if (position === 'def' && player.position === 'DF') {
      for (const def in this.playerObj[formation][position]) {
        if ( this.playerObj[formation][position].hasOwnProperty(def) ) {
           if (typeof this.playerObj[formation][position][def] === 'object') {
             // this.playerObj[formation][position][def] = player;
             if (Object.entries(this.playerObj[formation][position][def]).length===0){
               this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
               this.playerObj[formation][position][def] = player;
               this.defendersArray.push(player.player_id);
               if (this.defendersArray.length === 4) {
                 this.playerList.hide();
               }
               break;
             }
           }
          // console.log(this.playerObj[formation][position][def]);
        }
      }
    } else  if (position === 'mid' && player.position ==='MF') {
     for (const mid in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(mid) ) {
          if (typeof this.playerObj[formation][position][mid] === 'object') {
            // this.playerObj[formation][position][mid] = player;
            if (Object.entries(this.playerObj[formation][position][mid]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][mid] = player;
              this.midfieldersArray.push(player.player_id);
              if (this.midfieldersArray.length === 4) {
               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'fwd' && player.position ==='FW') {
     for (const fwd in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(fwd) ) {
          if (typeof this.playerObj[formation][position][fwd] === 'object') {
            // this.playerObj[formation][position][fwd] = player;
            if (Object.entries(this.playerObj[formation][position][fwd]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][fwd] = player;
              this.forwardsArray.push(player.player_id);
              if (this.forwardsArray.length === 2) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'gk' && player.position ==='GK') {
     for (const gk in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(gk) ) {
          if (typeof this.playerObj[formation][position][gk] === 'object') {
            // this.playerObj[formation][position][gk] = player;
            if (Object.entries(this.playerObj[formation][position][gk]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][gk] = player;
              this.goalkeepersArray.push(player.player_id);
              if (this.goalkeepersArray.length === 1) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   }
  }
} else if (formation === 'fiveFourOne') {
  for (const position in this.playerObj[formation]) {
    if (position === 'def' && player.position === 'DF') {
      for (const def in this.playerObj[formation][position]) {
        if ( this.playerObj[formation][position].hasOwnProperty(def) ) {
           if (typeof this.playerObj[formation][position][def] === 'object') {
             // this.playerObj[formation][position][def] = player;
             if (Object.entries(this.playerObj[formation][position][def]).length===0){
               this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
               this.playerObj[formation][position][def] = player;
               this.defendersArray.push(player.player_id);
               if (this.defendersArray.length === 5) {
                 this.playerList.hide();
               }
               break;
             }
           }
          // console.log(this.playerObj[formation][position][def]);
        }
      }
    } else  if (position === 'mid' && player.position ==='MF') {
     for (const mid in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(mid) ) {
          if (typeof this.playerObj[formation][position][mid] === 'object') {
            // this.playerObj[formation][position][mid] = player;
            if (Object.entries(this.playerObj[formation][position][mid]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][mid] = player;
              this.midfieldersArray.push(player.player_id);
              if (this.midfieldersArray.length === 4) {
               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'fwd' && player.position ==='FW') {
     for (const fwd in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(fwd) ) {
          if (typeof this.playerObj[formation][position][fwd] === 'object') {
            // this.playerObj[formation][position][fwd] = player;
            if (Object.entries(this.playerObj[formation][position][fwd]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][fwd] = player;
              this.forwardsArray.push(player.player_id);
              if (this.forwardsArray.length === 1) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'gk' && player.position ==='GK') {
     for (const gk in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(gk) ) {
          if (typeof this.playerObj[formation][position][gk] === 'object') {
            // this.playerObj[formation][position][gk] = player;
            if (Object.entries(this.playerObj[formation][position][gk]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][gk] = player;
              this.goalkeepersArray.push(player.player_id);
              if (this.goalkeepersArray.length === 1) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   }
  }
} else if (formation === 'fiveThreeTwo') {
  for (const position in this.playerObj[formation]) {
    if (position === 'def' && player.position === 'DF') {
      for (const def in this.playerObj[formation][position]) {
        if ( this.playerObj[formation][position].hasOwnProperty(def) ) {
           if (typeof this.playerObj[formation][position][def] === 'object') {
             // this.playerObj[formation][position][def] = player;
             if (Object.entries(this.playerObj[formation][position][def]).length===0){
               this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
               this.playerObj[formation][position][def] = player;
               this.defendersArray.push(player.player_id);
               if (this.defendersArray.length === 5) {
                 this.playerList.hide();
               }
               break;
             }
           }
          // console.log(this.playerObj[formation][position][def]);
        }
      }
    } else  if (position === 'mid' && player.position ==='MF') {
     for (const mid in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(mid) ) {
          if (typeof this.playerObj[formation][position][mid] === 'object') {
            // this.playerObj[formation][position][mid] = player;
            if (Object.entries(this.playerObj[formation][position][mid]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][mid] = player;
              this.midfieldersArray.push(player.player_id);
              if (this.midfieldersArray.length === 3) {
               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'fwd' && player.position ==='FW') {
     for (const fwd in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(fwd) ) {
          if (typeof this.playerObj[formation][position][fwd] === 'object') {
            // this.playerObj[formation][position][fwd] = player;
            if (Object.entries(this.playerObj[formation][position][fwd]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][fwd] = player;
              this.forwardsArray.push(player.player_id);
              if (this.forwardsArray.length === 2) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'gk' && player.position ==='GK') {
     for (const gk in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(gk) ) {
          if (typeof this.playerObj[formation][position][gk] === 'object') {
            // this.playerObj[formation][position][gk] = player;
            if (Object.entries(this.playerObj[formation][position][gk]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][gk] = player;
              this.goalkeepersArray.push(player.player_id);
              if (this.goalkeepersArray.length === 1) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   }
  }
} else if (formation === 'threeFiveTwo') {
  for (const position in this.playerObj[formation]) {
    if (position === 'def' && player.position === 'DF') {
      for (const def in this.playerObj[formation][position]) {
        if ( this.playerObj[formation][position].hasOwnProperty(def) ) {
           if (typeof this.playerObj[formation][position][def] === 'object') {
             // this.playerObj[formation][position][def] = player;
             if (Object.entries(this.playerObj[formation][position][def]).length===0){
               this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
               this.playerObj[formation][position][def] = player;
               this.defendersArray.push(player.player_id);
               if (this.defendersArray.length === 3) {
                 this.playerList.hide();
               }
               break;
             }
           }
          // console.log(this.playerObj[formation][position][def]);
        }
      }
    } else  if (position === 'mid' && player.position ==='MF') {
     for (const mid in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(mid) ) {
          if (typeof this.playerObj[formation][position][mid] === 'object') {
            // this.playerObj[formation][position][mid] = player;
            if (Object.entries(this.playerObj[formation][position][mid]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][mid] = player;
              this.midfieldersArray.push(player.player_id);
              if (this.midfieldersArray.length === 5) {
               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'fwd' && player.position ==='FW') {
     for (const fwd in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(fwd) ) {
          if (typeof this.playerObj[formation][position][fwd] === 'object') {
            // this.playerObj[formation][position][fwd] = player;
            if (Object.entries(this.playerObj[formation][position][fwd]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][fwd] = player;
              this.forwardsArray.push(player.player_id);
              if (this.forwardsArray.length === 2) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   } else  if (position === 'gk' && player.position ==='GK') {
     for (const gk in this.playerObj[formation][position]) {
       if ( this.playerObj[formation][position].hasOwnProperty(gk) ) {
          if (typeof this.playerObj[formation][position][gk] === 'object') {
            // this.playerObj[formation][position][gk] = player;
            if (Object.entries(this.playerObj[formation][position][gk]).length===0){
              this.playerStatusCheck (player.player_id, playerIndex, playerPosition, playerType, maxPlayers) ;
              this.playerObj[formation][position][gk] = player;
              this.goalkeepersArray.push(player.player_id);
              if (this.goalkeepersArray.length === 1) {

               // if (this.deviceService.isMobile()){
                  this.playerList.hide();
                // } else {
                  // alert('click a player position in the pitch first');
                // }
              }
              break;
            }
          }
         // console.log(this.playerObj[formation][position][def]);
       }
     }
   }
  }
}*/
}
 }
}

