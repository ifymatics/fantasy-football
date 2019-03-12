import { LobbyService } from './../lobby.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { UtilityService } from './../../utility.service';
import { AuthloginService } from './../../user/authlogin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-join-contest',
  templateUrl: './join-contest.component.html',
  styleUrls: ['./join-contest.component.scss']
})
export class JoinContestComponent implements OnInit {
  @ViewChild('firstThingsModal') firstThingsModal: ModalDirective;
  toJoinContest;
  message;
  // collectionMasterId;
  mobile;
  clickedIndex: number;
  isLoading = false;
  showReload = false;
  session;
  league = null;
  data: {};
  masterData: any;
  posting           = false;
  isTurbo             = 0;
  emptyScreen         = false;
  lobbyMasterDataArr  = [];
  playerActive        = {};
  currentContest      = {};
  contestList         = [];
  featuredContestList = [];
  matchList           = [];
  lineupList          = [];
  contestListOffset   = 0;
  loadMorePosting     = false;
  isLoadMore          = false;
  collection_list     = [];
  selectedCollection  = {};
  league_list         = [];
  selectedLineup      = '';
  filters;
  leagueList;
  leagueListFilter;
  ref_ps_detail = {} ;
  sports_id = 5;
  sports;
  currentUser;
  // Sorting Methods
  sort = {
    sort_order: 'ASC',
    sort_field: 'C.season_scheduled_date'
        };
   // LEAGUE FILTERS
   selectedFilterObj = {
    winner : {min: '', max: ''},
    entry_fee : {min: '', max: ''},
    participants : {min: '', max: ''},
    league : ''
};
selectedLeague = '';
onAnimate = false;
onCreateTeamAnimate = false;

  constructor(private service: AuthloginService,
    private utilityService: UtilityService,
     private router: Router,
     private lobbyservice: LobbyService,
     private route: ActivatedRoute
     ) {
   // this.service.isLoggedIn = this.utilityService.checkLocalStorageStatus('user');
    // console.log(this.league.league_id);
   this.isLoading = true;
   this.league = this.utilityService.getLocalStorage('league');
   this.session =
    (this.utilityService.getLocalStorage('user'))
    ? this.utilityService.getLocalStorage('user').data.session_key
    : '' ;
   // (!this.league) ? this.router.navigate(['/league']) : console.log('Redirecting to league');

 /* this.service.api('fantasy/lobby/get_lobby_master_data', this.data, 'post', this.session)
 .subscribe(
   data => {
      console.log(data);
     this.masterData = data['data'];
     this.featuredContestList = this.masterData.featured_contest_list;
     this.filters = this.masterData.filters;
     this.leagueList = this.masterData.league_list;

      this.leagueList.forEach( function(obj) {
       league_filter.push(obj);
       // console.log(obj);
  });

  this.leagueListFilter = league_filter;
  this.leagueList = this.masterData.league_list;
  this.sports = this.masterData.sports;
  this.collection_list = this.masterData.collection_list;

  this.ref_ps_detail = this.masterData.ref_ps_detail;
  this.getContestSeason({}, 0);
    },
   error => error
 );*/
 this.getContestSeason({}, 0);
 this.LobbyMasterData();
   }
  ngOnInit() {
    this.route.params.subscribe(
      (params: ParamMap) => {
        console.log(params['id']);
        this.league.league_id = params['league_id'];
      }
    );
    const league_filter = [];
    /* this.data = {
       'sports_id' : 5,
     'league_id' : this.league.league_id};*/
   // this.service.isLoggedIn = this.utilityService.checkLocalStorageStatus('user');
   if (this.utilityService.checkLocalStorageStatus('user')) {
    this.currentUser = this.utilityService.getLocalStorage('user').data.user_profile;
    console.log(this.currentUser);
   }
   }
LobbyMasterData() {
  const league_filter = [];
 this.data = {
    'sports_id' : 5,
  'league_id' : +this.league.league_id};
  this.service.api('fantasy/lobby/get_lobby_master_data', this.data, 'post', this.session)
  .subscribe(
    data => {
       console.log(this.data);
      this.masterData = data['data'];
      this.featuredContestList = this.masterData.featured_contest_list;
      this.filters = this.masterData.filters;
      this.leagueList = this.masterData.league_list;

      for ( const obj of  this.leagueList ) {
        league_filter.push(obj);
        // console.log(obj);
   }

   this.leagueListFilter = league_filter;
   this.leagueList = this.masterData.league_list;
   this.sports = this.masterData.sports;
   this.collection_list = this.masterData.collection_list;

   this.ref_ps_detail = this.masterData.ref_ps_detail;
  // this.getContestSeason({}, 0);
     },
    error => {
      if (error['error']['global_error'] === 'Session key has expired') {
        this.message = error['error']['global_error'];
        this.router.navigate(['/']);
      }
    }
  );
}
getContestSeason(collection, offset) {
  this.isLoading = true;
  if (offset) {
    this.loadMorePosting = true;
} else {
  this.posting = true;
  this.emptyScreen = false;
}

const param = {
    'sports_id': 5,
    'collection_master_id': (collection.collection_master_id) ? collection.collection_master_id : '',
    // 'entry_fee_from': this.selectedFilterObj.entry_fee.min,
    // 'entry_fee_to': this.selectedFilterObj.entry_fee.max,
   // 'prizepool_from': this.selectedFilterObj.winner.min,
    // 'prizepool_to': this.selectedFilterObj.winner.max,
    // 'participants_from': this.selectedFilterObj.participants.min,
    // 'participants_to': this.selectedFilterObj.participants.max,
    'sort_field': this.sort.sort_field,
    'sort_order': this.sort.sort_order,
    // 'is_turbo_lineup': 0,
    // 'contest_access_type': 0,
    // 'is_quick_contest' : 0,
    // "is_referral": 1,// This condition only for refer a frind banner add (Only for new lobby)
    'offset': offset || '0',
    'league_id': this.league.league_id,
};
/*if (this.isTurbo !== 0) {
    param.is_turbo_lineup = (this.isTurbo === 1) ? 1 : 0;
    param.contest_access_type = (this.isTurbo === 2) ? 1 : 0;
    param.is_quick_contest = (this.isTurbo === 3) ? 1 : 0;
}*/

this.service.api('fantasy/lobby/get_contests_of_collection', param, 'post', this.session)
.subscribe((result) => {
  this.isLoading = false;
  console.log(result);
  if (!offset) {
    this.contestList = result['data'].contest_list;
  } else {
    this.contestList = this.contestList.concat(result['data'].contest_list);
  }
    this.contestListOffset = result['data'].offset;
    this.isLoadMore = result['data'].is_load_more;

    if (!offset) {
        this.contestList = result['data'].contest_list;
    } else {
        this.contestList = this.contestList.concat(result['data'].contest_list);

    }
    this.posting = false;
    this.loadMorePosting = false;
    this.emptyScreen = (this.contestList.length === 0) ? true : false;
}, (error) => {
    this.posting = false;
    this.isLoading = false;
    this.loadMorePosting = false;
    this.showReload = true;
    console.log(error);
    if (error['error']['global_error'] === 'Session key has expired') {
      this.message = error['error']['global_error'];
      this.router.navigate(['/']);
    }
});

}
// check if the user has a completed profile
checkProfileComplete() {
  const userDetail = this.utilityService.getLocalStorage('user');
  // !userDetail.user_profile.dob ||
 // console.log(userDetail.data.user_profile);
  if (!userDetail.data.user_profile.email || !userDetail.data.user_profile.first_name) {
     // call for profile complete
    // profileCmpltAlertModalInit();
      return true;
  } else {
      return false;
  }
}

checkUserSubscription(contest, string, contestType) {
  this.onAnimate = true;
  console.log(this.onAnimate);
  console.log(contest, string, contestType);
  this.toJoinContest = contest;
  /*
  check if the user has enough cash to join OR if he paid the subscription
   */
  this.joinContest(contest);
}
joinContest(contestData) {
  if (this.checkProfileComplete()) {
    return;
}
// console.log(contest);
const param = {
    'collection_master_id': contestData.collection_master_id
};

this.service.api('fantasy/lobby/get_user_lineup_list', param, 'post', this.session).
subscribe((response) => {
    if (response['response_code'] === 200) {
       this.lineupList = response['data'];
       console.log(this.lineupList);
        if (this.lineupList.length === 0) {
            // firstThingsModal(vm.selectedCollection, false, contest)
            this.firstThingsModal.show();
        } else {
            this.joinGame(contestData, this.selectedLineup, this.lineupList);
        }
     }
}, (error) => {
    // alert(error.global_error);
    if (error['error']['global_error'] === 'Session key has expired') {
      this.message = error['error']['global_error'];
      this.router.navigate(['/']);
    }
});
}

fromFirstThingsModal() {
  this.onCreateTeamAnimate = true;
    // this.service.interComponetsTalks(this.lineupList, 'lineup');
    console.log('its working');
   /*const contest = [];
    contest['contest'] = this.toJoinContest;
    contest['lineup'] = this.lineupList;
   this.service.interComponetsTalks( this.toJoinContest, 'contest');
          setTimeout(
            () => {  this.router.navigate([this.sports_id + '/lineup']);
        },
         500);*/
          this.lobbyservice.toFirstThingFirst(this.toJoinContest, this.lineupList);
}
toggleContestInfo(i: number) {
  if (i >= 0) {
    this.clickedIndex = i;
    // console.log(i);
    this.mobile = !this.mobile;
  }

}
joinGame(contestData, lineup, lineupList) {
  let isAvail = true,
  isTurbo = false;

  // Condition for check team created or not and redirect to perticular normal and turbo lineup
  if (contestData.is_turbo_lineup === '1') {
  const isTurboAvail = this.utilityService.filterArr(lineupList, 'is_turbo_lineup', contestData.is_turbo_lineup);
  const isTurboTypeAvail = this.utilityService.filterArr(lineupList, 'turbo_lineup_type', contestData.turbo_contest_type);
  if (!isTurboAvail.length) {
  isAvail = false;
  isTurbo = true;
  } else if (!isTurboTypeAvail.length) {
   isAvail = false;
   isTurbo = true;
    }
  } else {
    const isRegAvail = this.utilityService.filterArr(lineupList, 'is_turbo_lineup', contestData.is_turbo_lineup);
   if (!isRegAvail.length) {
   isAvail = false;
    }
  }
 // @isAvail : when line type is not available.
  if (isAvail) {
  this.joinGameModals(contestData, lineup, lineupList, isTurbo);
  } else {
  // this.joinGamePrompt(contest, lineup, lineupList, isTurbo);
  }
}
getPriceDistributionWinner(price_list) {
  let winner = price_list.length;
  for (const price of price_list ) {
    if (price.min !== price.max) {
      winner = price.max;
  }

   }
  return winner;
}
joinGameModals(contest, lineup, lineupList, isTurbo) {
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
              console.log('you ARE ALLOWED');
         // this.joinGameInit(contest, lineup, currentBalance, lineupList, user_balance);
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
