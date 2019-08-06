
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LobbyService } from './../lobby.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { UtilityService } from './../../utility.service';
import { AuthloginService } from './../../user/authlogin.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/Operators';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-join-contest',
  templateUrl: './join-contest.component.html',
  styleUrls: ['./join-contest.component.scss']
})
export class JoinContestComponent implements OnInit, OnDestroy {
  @ViewChild('firstThingsModal') firstThingsModal: ModalDirective;
  @ViewChild('joinGameConfirmModal') joinGameConfirmModal: ModalDirective;
  @ViewChild('subscriptionModal')  subscriptionModal: ModalDirective;
 
  toJoinContest;
  confirmJoinForm;
  message;
  tag;
  error;
  // collectionMasterId;
  mobile;
  joinButtonclicked = false;
  firstThingClicked = false;
  contestId = '';
  ButtonDisabled = false;
  joinButtonDisabled = false;
  autodisabled = false;
  clickedIndex: number;
  isLoading = false;
  showReload = false;
  session;
  league = {league_id: ''};
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
  selectedLineup      = {};
  filters;
  leagueList;
  leagueListFilter;
  ref_ps_detail = {} ;
  sports_id = 5;
  sports;
  currentUser;
  league_selected;
  joinGameInitObj;
  subscriptionObj = {amount:1000, token:5}
  /* sponsor"s image starts*/
   rightBtmSponList      = [];
  rightTopSponList    = [];
  HeaderCenterSponList = [];
  HeaderSliderSponList = [];
  lsObjPosting = false;
  lsObj = {'header_center': {}, 'right_top': {}, 'right_bottom': {}, 'header_slider': {}};
  league_detail;
  sponsorIntervals = [];
  disabled = false;
  /* sponsor"s image ends*/
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
    league : {league_name: ''}
};
selectedLeague = '';
onAnimate = false;
onCreateTeamAnimate = false;
subscription;
  constructor(private service: AuthloginService,
    private utilityService: UtilityService,
     private router: Router,
     private lobbyservice: LobbyService,
     private route: ActivatedRoute,
     public deviceService: DeviceDetectorService
     ) {}
  ngOnInit() {
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ) .subscribe(
      () => window.scrollTo(0,0)
    );
    this.route.params.subscribe(
      (params: ParamMap) => {
        this.league.league_id = params['league_id'];
        this.sports_id = +params['id'];
      //  console.log( this.league.league_id);
       // console.log(params['league_id']);
      }
    );

    this.confirmJoinForm = new FormGroup({
      'lineup': new FormControl(null, [Validators.required]),
     // 'create': new FormControl(null, [Validators.required]),
    });
    const league_filter = [];
    /* this.data = {
       'sports_id' : 5,
     'league_id' : this.league.league_id};*/
   // this.service.isLoggedIn = this.utilityService.checkLocalStorageStatus('user');
   if (this.utilityService.checkLocalStorageStatus('user')) {
    this.currentUser = this.utilityService.getLocalStorage('user').data.user_profile;
    this.league = this.utilityService.getLocalStorage('league');
   this.session =
    (this.utilityService.getLocalStorage('user'))
    ? this.utilityService.getLocalStorage('user').data.session_key
    : '' ;
    this.league_selected = this.utilityService.getLocalStorage('league');
   // console.log(this.currentUser);
    this.setFilterLabel(this.league_selected, 'league', true);
    this.getContestSeason({}, 0);
 this.LobbyMasterData();
   }
   this.isLoading = true;
   }
   ngOnDestroy() {
     this.subscription.unsubscribe();
   }
LobbyMasterData() {
  const league_filter = [];
 this.data = {
    'sports_id' : 5,
  'league_id' : +this.league.league_id};
  this.service.api('fantasy/lobby/get_lobby_master_data', this.data, 'post', this.session)
  .subscribe(
    data => {
      // console.log(this.data);
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
      // console.log(this.data);
     // console.log(error);
      if (error['error']['global_error'] === 'Session key has expired') {
        this.message = error['error']['global_error'];
        this.tag = 'danger';
        setTimeout(() =>  this.router.navigate(['/']) , 5000);
       // this.router.navigate(['/']);
      }
    }
  );
}
getContestSeason(collection, offset?) {
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
    'league_id': (collection.league_id) ? collection.league_id : this.league.league_id,
};
/*if (this.isTurbo !== 0) {
    param.is_turbo_lineup = (this.isTurbo === 1) ? 1 : 0;
    param.contest_access_type = (this.isTurbo === 2) ? 1 : 0;
    param.is_quick_contest = (this.isTurbo === 3) ? 1 : 0;
}*/
// console.log(collection);
// if(collection) {param.league_id =  }
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
    if (this.utilityService.checkLocalStorageStatus('contestList')) {
      this.utilityService.clearLocalStorage('contestList');
      this.utilityService.setLocalStorage('contestList', this.contestList);
    } else {
      this.utilityService.setLocalStorage('contestList', this.contestList);
    }
    /*if (!offset) {
        this.contestList = result['data'].contest_list;
    } else {
        this.contestList = this.contestList.concat(result['data'].contest_list);

    }*/
    this.posting = false;
    this.loadMorePosting = false;
    this.emptyScreen = (this.contestList.length === 0) ? true : false;
}, (error) => {
    this.posting = false;
    this.isLoading = false;
    this.loadMorePosting = false;
    this.showReload = true;
    // console.log(error);
    // console.log(param);
    if (error['error']['global_error'] === 'Session key has expired') {
      this.tag = 'danger';
      this.message = error['error']['global_error'];
      setTimeout(() =>  this.router.navigate(['/']) , 5000);
      // this.router.navigate(['/']);
    }
});

}
setFilterLabel(item, type, init) {

  if (type === 'league') {
      this.utilityService.setLocalStorage('league', item);
      this.league_selected = item;
  }

  if (item) {
      this.selectedFilterObj[type] = item;
  }
  if (!init) {
      // this.getContestSeason(this.selectedCollection);
      this.getContestSeason( this.league_selected);
  }
}
getFirstContest(collection) {
  this.selectedCollection = collection;
}
getLobbyMatches(league) {
  this.posting = true;
  this.selectedLeague = league;
  this.league_selected = league;
  this.contestList = [];
  this.collection_list = [];
  this.selectedCollection = {};
  // this.overlayDiv = false;
  this.lineupList = [];
  const param = {
      'sports_id': this.sports_id,
      'league_id': ''
  };

  if (league) {
      param.league_id = league.league_id;
  }

  this.service.api('fantasy/lobby/get_lobby_matches', param, 'POST', this.session)
  .subscribe(
    (response) => {
      response = response.data;
      if (response.collection_list.length) {
         this.collection_list = response.collection_list;
          this.getContestSeason(league, 0);
      } else {
         this.posting = false;
      }
      this.getFeatureContest(league.league_id);
     this.get_sponsor_images();
  }, (error) => {
     this.posting = false;
     // console.log(error);
  });
}
getFeatureContest(league_id) {
  this.featuredContestList = [];
  const sports_id = this.sports_id,
  reqParams = {
      'sports_id' : sports_id,
      'league_id' : league_id
  };
  this.service.api('fantasy/lobby/get_lobby_feature_contest', reqParams, 'POST', this.session)
 .subscribe((response) => {
      this.featuredContestList = response.data;
  }, (error) => {
  });
}
get_sponsor_images() {

  const league_selected = this.utilityService.getLocalStorage('league_data');

  if (!league_selected.league_id) {
      return true;
  }
 this.clearAllIntervals();
  const reqParams = {type: '1,2,3,4', league_id: league_selected.league_id};  // 1 for right_bottom, 2 for  right_top, 3 for header Center
  this.service.api('fantasy/league_sponsor/league_sponsor_list', reqParams, 'POST', this.session)
  .subscribe((response) => {
      if (response.response_code === 200) {
     this.rightBtmSponList = this.utilityService.filterArr(response.data.advertisements, 'ls_position_id', 1);
     this.rightTopSponList = this.utilityService.filterArr(response.data.advertisements, 'ls_position_id', 2);
     this.HeaderCenterSponList = this.utilityService.filterArr(response.data.advertisements, 'ls_position_id', 3);
     this.HeaderSliderSponList = this.utilityService.filterArr(response.data.advertisements, 'ls_position_id', 4);
     this.league_detail = {'background_image': league_selected.background_image};


      // if(stopTime)
     // {
          // $interval.cancel(stopTime);
     // }
    this.clearAllIntervals();

      this.updateSponsorBanner();
         this.sponsorIntervals.push(setInterval(this.updateSponsorBanner, 5000));
      }

     // console.log("stopTime",stopTime);
      this.lsObjPosting = true;
  }, (error) => {
  });
}
clearAllIntervals () {

  this.sponsorIntervals.forEach((interval) => {
                const is_cancel = clearInterval(interval);
            });
           // $rootScope.sponsorIntervals.length = 0; //clear the array
            this.sponsorIntervals = [];
  }
  updateSponsorBanner = () => {
    const user = this.utilityService.getLocalStorage('user');

      if (user) {
       const rightBtmSponList      = this.rightBtmSponList[Math.floor(Math.random() * this.rightBtmSponList.length)],
           rightTopSponList      = this.rightTopSponList[Math.floor(Math.random() * this.rightTopSponList.length)],
           HeaderCenterSponList  = this.HeaderCenterSponList[Math.floor(Math.random() * this.HeaderCenterSponList.length)];

        this.lsObj.right_bottom   = rightBtmSponList;
        this.lsObj.right_top      = rightTopSponList;
        this.lsObj.header_center  = HeaderCenterSponList;
      } else {
         this.clearAllIntervals();
      }
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
  this.contestId = contest.contest_id;
  this.joinButtonclicked = true;
  this.joinButtonDisabled = true;

 // console.log(contest);
  this.toJoinContest = contest;
  const param = {
    'league_id': '',
    'sub_amt': 0,
    'user_id': this.currentUser.user_id
   };
 
  // check if the user has enough cash to join OR if he paid the subscription
   if (contest.contest_access_type === '2') {
    console.log(contest);
    param.league_id = contest.league_id;
   this.service.api('user/finance/get_user_subscribed', param, 'POST', this.session)
   .subscribe( (response) => {
     console.log(response);
      if (response.response_code === 200) {
        const  subscribed_data = response.data;
        this.joinContest(contest);
        } else if (response.response_code === 'NOT SUBSCRIBED') {
         param.sub_amt = 250;
            const txt = "THE SUBSCRIPTION FEE WILL BE DEDUCTED FROM YOUR ACCOUNT BALANCE IF YOU HAVE ENOUGH CASH?";
            // if (confirm(txt)) {
            //   this.service.api('user/finance/get_user_balance_checker', param,'POST', this.session)
            //    .subscribe((res) =>  {
            //      if (res.response_code === 'NOBALANCE') {
            //         // notSubscribedInit(contest);
            //         console.log(res.response_code);
            //      } else {
            //       this.joinContest(contest);
            //       }
            //    },
            //    (error) => {
            //     this.joinButtonclicked = true;
            //     this.joinButtonDisabled = true;
            //      console.log(error);
            //   });
            //   } else {
            //  // notSubscribedInit(contest);
            //    }
               this.subscriptionModal.show();
       }
   });
  }
//    // end of subscription check
 else { 

this.service.api('user/finance/get_user_balance', param, 'POST', this.session)
.subscribe(
  (response) => {
 if (response.response_code === 200) {
  
   // console.log(response);
   const user_balance =  response.data.user_balance,
      point_balance = parseFloat(user_balance.point_balance),
      etry_free     = parseFloat(contest.entry_fee);
      this.utilityService.userBalance.emit( 'its working' );
    if (!this.utilityService.isAbleToJoinContest(user_balance, contest.entry_fee) &&
    (contest.prize_type === 0 || contest.prize_type === 1)) {
      this.tag = 'danger';
      this.error = 'You dont have enough cash';
     // alert('You dont have enough cash');
         // this.notEnoughCashInit(contest.entry_fee, user_balance, contest);
    } else if ((etry_free > point_balance) &&
    (contest.prize_type === 2 || contest.prize_type === 3)) {
      this.tag = 'danger';
      this.error ='You dont have enough cash';
      // alert('You dont have enough cash');
         // this.notEnoughCashInit(contest.entry_fee, user_balance, contest);
    } else if (contestType === 'normal_contest') {
          this.joinContest(contest);
       } else if (contestType === 'featured_contest') {
         //  this.joinFeaturedGame(contest, lineupList);
       }
 } else { this.joinButtonDisabled = false;  this.contestId = '';}
});
 }
  /*-----------*/
 //  this.joinContest(contest);
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
      //  console.log(this.lineupList);
        if (this.lineupList.length === 0) {
          this.joinButtonclicked = false;
          this.contestId = '';
            // firstThingsModal(this.selectedCollection, false, contest)
            this.firstThingsModal.show();
        } else {
            this.joinGame(contestData, this.selectedLineup, this.lineupList);
        }
     }
}, (error) => {
  this.joinButtonclicked = false;
  this.contestId = '';
    // alert(error.global_error);
    if (error['error']['global_error'] === 'Session key has expired') {
      this.tag = 'danger';
      this.error = error['error']['global_error'];
      setTimeout(() =>  this.router.navigate(['/']) , 5000);
    }
});
}

fromFirstThingsModal() {
  this.ButtonDisabled = true;
  this.firstThingClicked = true;
  // this.onCreateTeamAnimate = true;
    // this.service.interComponetsTalks(this.lineupList, 'lineup');
   // console.log('its working');
   /*const contest = [];
    contest['contest'] = this.toJoinContest;
    contest['lineup'] = this.lineupList;
   this.service.interComponetsTalks( this.toJoinContest, 'contest');
          setTimeout(
            () => {  this.router.navigate([this.sports_id + '/lineup']);
        },
         500);*/
          this.lobbyservice.toFirstThingFirst(this.toJoinContest, this.lineupList, '' );
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
  // joinGameModals(contest, lineup, lineupList, isTurbo) {
    const user = this.utilityService.getLocalStorage('user').data;
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
         // console.log(currentBalance);
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
        this.tag = 'danger';
        setTimeout(() =>  this.router.navigate(['/']) , 5000);
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
        this.joinButtonclicked = false;
        // this.modalservice.showJoinConfirm();
       // console.log(this.joinGameInitObj);
    }

   // this.joinGameConfirmModal.show();

confirmJoinContest(lineup?) {
   this.joinGameConfirmModal.hide();
 // this.modalservice.showJoinConfirm('hide');
  const param = {
  'contest_id': this.joinGameInitObj.contest.contest_id,
  'lineup_master_id': this.confirmJoinForm.value.lineup,
  'promo_code': this.confirmJoinForm.value.lineup.promo_code
  };
// console.log(this.confirmJoinForm.value.lineup[0], param);

this.service.api('fantasy/contest/join_game', param, 'POST', this.session)
.subscribe((response) => {
 // console.warn(response);
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
  this.tag ='success';
  this.error = response.message;
 // alert(response.message);
  this.router.navigate([
    "/" +
      this.sports_id +
      "/" +
      this.league.league_id +
      "/my-league"
  ]);
 //  $rootScope.joinContestSuccessModalInit(response.message); //Success modal init

}, (error) => {
 // emitAlert.on(error.global_error, 'danger');
 if (error['error']['global_error'] === 'Session key has expired') {
  this.message = error['error']['global_error'];
  this.tag = 'danger';
  setTimeout(() =>  this.router.navigate(['/']) , 5000);
}
//  this.tag = 'danger';
//  this.message = error.error['global_error'];
// alert(error.error['global_error']);
 // console.log(error);
});
}
onSelectOption(event) {
 // console.log(event);
 // console.log(this.confirmJoinForm.value.lineup);
  if (event === 'create') {
    if (this.utilityService.checkLocalStorageStatus) {
      this.utilityService.clearLocalStorage('mylineupList');
      this.utilityService.setLocalStorage('myLineupList', this.lineupList);
    }
   // this.modalservice.showJoinConfirm('hide');
     this.joinGameConfirmModal.hide();
    this.lobbyservice.toFirstThingFirst(this.toJoinContest, this.lineupList, '');
  }

}
subscribeNow(){
  this.subscriptionModal.hide();
  this.isLoading = true;
  const param = {
    'amount': this.subscriptionObj.amount,
    'league_id': this.league.league_id,
    'token':  this.subscriptionObj.token,
    'return_url': this.router.url
};
 const url = 'user/paystack/subscription';
  this.service.api(url , param, 'POST', this.session)
  .subscribe((response) =>{
      if (response.response_code === 200) {
        // console.log(response);
          window.location.href = response.data.authorization_url;
      }
  }, (error) => {
    this.disabled = false;
      console.log(error);
      // emitAlert.on(display, 'danger');
  });
}
}
