import { AuthloginService } from "./../../user/authlogin.service";
import { UtilityService } from "./../../utility.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  ParamMap,
  NavigationStart
} from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { filter } from "rxjs/Operators";
import { LobbyService } from "src/app/lobby/lobby.service";

@Component({
  selector: "app-live",
  templateUrl: "./live.component.html",
  styleUrls: ["./live.component.scss"]
})
export class LiveComponent implements OnInit, OnDestroy {
  menu = false;
  blue = false;
  toggle = false;
  mobile = false;
  isMobile = false;
  //header testing
  isLoading = false;
  btn = false;
  defclass;
  midclass;
  fwclass;
  isDisabled = false;
  showNoPitch = false;
  collections;
  isPopulated = false;
  toggledContest = 0;
  mobileToggle = false;
  // @Output() clickedCollection: EventEmitter = new EventEmitter();
  substitutePlayerAllowed = 0;
  defPlayers = [];
  midPlayers = [];
  fwdPlayers = [];
  checkContest_id = [];
  substitutePlayersArr = [];
  substituted_players = [];
  selected_collection_start = 0;
  playerActive = {};
  playersArr = [];
  league_id;
  // lineupDetails     = [];
  contestListData = [];
  contestListRank = [];
  currentMatch = "Completed";
  seasonganeUid = "";
  isSelected = {};
  selectedUserId = "";
  groundLoading = true;
  posting = false;
  emptyScreen = false;
  creaditleft = 0;
  contestListOffset = 0;
  loadMorePosting = false;
  normalLineup = true;
  collection_detail = {};
  selectedLineUp = {};
  selectedLeague = {};
  substituted_count = 0;
  player_position;
  league;
  totalUserJoined = 0;
  turboLineup;
  selectedLineupMasterContetId;
  isLoadMore = false;
  sports_id = 5;
  device = "";
  lineupDetails = [];
  mobileDevice;
  teamInfo: {
    is_turbo_lineup: number;
    collection_master_id: number;
    league_id: number;
    lineup_master_id: number;
    rank: "";
    team_name: "";
  };
  OnViewSelect = {
    selectedContest_id: "",
    selectedlineu_id: "",
    SelectedCollections: []
  };
  subscription;
  viewLiveRank = false;
  viewCompletedRank = false;
  currentUser;
  userNameLable;
  session;
  defaultEndPosition;
  totalSalary;
  redoPlayerId;
  message;
  status;
  match = [];
  teamName;
  private socketObSubscription: Subscription;
  constructor(
    private deviceService: DeviceDetectorService,
    private utilityservice: UtilityService,
    private service: AuthloginService,
    private router: Router,
    private lobbyservice: LobbyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        console.log(window.scrollY);
      });
    this.mobileDevice = this.deviceService.isMobile();
    this.route.parent.params.subscribe((params: ParamMap) => {
      this.league_id = params["league_id"];
      // console.log(params);
    });
    if (this.deviceService.isMobile()) {
      this.device = "mobilePitch";
      // console.log(this.device);
      this.isMobile = true;
    } else if (this.deviceService.isDesktop) {
      this.device = "desktopPitch";
      this.showNoPitch = false;
    }
    if (this.utilityservice.checkLocalStorageStatus("user")) {
      const user = this.utilityservice.getLocalStorage("user");
      this.currentUser = user.user_profile;
      this.session = user.data.session_key;
      this.selectLeagueType(1);
    }
    // const socketObservable = Observable.create(
    //   observer => {
    //     setInterval(() => {
    //       const data = this.selectLeagueType(1);
    //       observer.next(data);

    //      // this.selectLeagueType(1);
    //     }, 6000);
    //   }
    // );
    //  this.socketObSubscription = socketObservable.subscribe(data => {
    //   console.log(data);
    // }) ;
  }
  ngOnDestroy() {
    // this.socketObSubscription.unsubscribe();
  }
  selectLeagueType(status) {
    this.isLoading = true;
    // console.log(status);
    // this.posting                     = true;
    this.isSelected = {};
    // this.lineupDetails               = [];
    // this.playersArr                  = [];
    // this.playerActive                = {};
    this.contestListData = [];
    this.viewLiveRank = false;
    this.viewCompletedRank = false;
    this.currentMatch = "Live";
    this.isSelected[this.currentMatch] = "active";
    const param = {
      status: status,
      sports_id: 5 // this.sports_id,
      // 'league_id':  this.league_id
    };
    this.service
      .api(
        "fantasy/contest/get_collections_by_status",
        param,
        "POST",
        this.session
      )
      .subscribe(
        response => {
          // console.log(param);
          this.isLoading = false;
          //  this.posting       = false;
          //  this.groundLoading = false;
          response = response.data;
          // console.log(response);
          if (!response.collections.length) {
            // this.fillPlayGround([]);
          }

          this.contestListData = response.collections;
          // this.fistItemInArray(this.contestListData);
          // console.warn(this.contestListData);
        },
        error => {
          this.isLoading = false;
          // console.log(error);
          if (error["error"]["global_error"] === "Session key has expired") {
            this.message = error["error"]["global_error"];
            this.router.navigate(["/"]);
          }
          // this.posting = false;
        }
      );
  }
  gotoLineup(league) {
    if (
      this.utilityservice.checkLocalStorageStatus("private_games") &&
      this.utilityservice.checkLocalStorageStatus("lineupDetails")
    ) {
      this.utilityservice.clearLocalStorage("private_games");
      this.utilityservice.clearLocalStorage("lineupDetails");
    }
    this.utilityservice.setLocalStorage("private_games", this.selectedLeague);
    this.utilityservice.setLocalStorage("lineupDetails", this.lineupDetails);
    // console.log(league);
    // console.log(this.lineupDetails);
    if (this.teamInfo.is_turbo_lineup === 1) {
      this.router.navigate([
        "/turbolineup",
        {
          position: league.position,
          league_id: league.league_id,
          collection_master_id: league.collection_master_id,
          is_league: league.is_league ? 1 : 0,
          lineup_master_id: league ? league.lineup_master_id : null
          // contest_id      : league.featured_contest_id ? league.featured_contest_id : 0
        }
      ]);
    } else {
      const lineup = league;
      this.lobbyservice.toFirstThingFirst(league, lineup, "upcoming");
    }
  }
  getTeamLineup(lineup, league, collection) {
    this.teamName = lineup.team_name;
    this.OnViewSelect.selectedlineu_id = lineup.lineup_master_id;
    this.isLoading = true;
    this.checkContest_id = [];
    this.btn = true;
    this.checkContest_id.push(league.contest_id);
    // console.log(lineup.lineup_master_id);
    // console.log(this.OnViewSelect.selectedlineu_id);
    this.totalUserJoined = league ? league.total_user_joined : 0;
    this.selectedLineupMasterContetId = lineup.lineup_master_contest_id;
    // this.teamInfo                = {is_turbo_lineup: 0};
    // this.lineupDetails           = [];
    this.selectedLineUp = lineup;
    this.selectedLeague = league;
    this.groundLoading = true;
    this.userNameLable = lineup;
    this.substitutePlayersArr = [];
    this.substituted_players = [];
    this.substitutePlayerAllowed = 0;
    this.setPlayersPosition();
    if (collection) {
      this.selected_collection_start = collection.collection_start_status;
    }
    // this.selectedContest = league.contest_id;
    // Clear selcted substitute rosters
    const param = {
      lineup_master_contest_id: lineup.lineup_master_contest_id
    };
    this.service
      .api(
        "fantasy/contest/get_linpeup_with_score",
        param,
        "POST",
        this.session
      )
      .subscribe(
        response => {
          this.groundLoading = false;
          if (response.response_code === 200) {
            this.isLoading = false;
            this.lineupDetails = response.data.lineup;
            //console.log(this.lineupDetails);
            this.teamInfo = response.data.team_info;
            this.teamInfo.collection_master_id =
              response.data.lineup[0].collection_master_id;
            this.teamInfo.league_id = response.data.lineup[0].league_id;
            // console.log( this.teamInfo.league_id);
            this.teamInfo.lineup_master_id =
              response.data.lineup[0].lineup_master_id;
            this.teamInfo.rank = this.router.isActive("livecontest", true)
              ? lineup.current_rank
              : lineup.game_rank; // New Changes
            this.totalSalary = response.data.total_salary_cap;
            this.substitutePlayerAllowed =
              response.data.substituted_count === 0
                ? 2
                : response.data.substituted_count === 2
                  ? 0
                  : response.data.substituted_count;
            // 0 (2 substitute available), 2 (0 substitution allowed)
            this.substituted_players = response.data.substituted_players;
            // Set position for turbo linup
            // console.log(this.lineupDetails);
            // console.log(this.playersArr);
            if (response.data.team_info.is_turbo_lineup === "1") {
              this.player_position = response.data.team_info.turbo_lineup_type;
            }
            // this.resetSubsTituteParams(); // Clear all substitution parameters
            this.fillPlayGround(this.lineupDetails);
            // console.log(this.lineupDetails);
            if (this.lineupDetails.length > 0) {
              this.isPopulated = true;
              this.deviceService.isMobile()
                ? (this.isDisabled = true)
                : (this.isDisabled = false);
            }
          }
        },
        error => {
          this.isLoading = false;
          this.groundLoading = false;
          // alert(UtilityService.getErrorMessage(error), 'danger');
          if (error["error"]["global_error"] === "Session key has expired") {
            this.message = error["error"]["global_error"];
            this.router.navigate(["/"]);
          }
          this.btn = false;
        }
      );
  }
  onView(lineup_master_id, contest_id, collection) {
    console.log(lineup_master_id);
    collection["is_live"] = true;
    // this.Leagueservice.getContestDataOnviewNavigate(collection);
    this.utilityservice.checkLocalStorageStatus("collection")
      ? this.utilityservice.clearLocalStorage("collection")
      : this.utilityservice.setLocalStorage("collection", collection);
    // console.log(collection);
    // console.log(lineup_master_id, contest_id, collection.collection_master_id);
    // this.router.navigate(['/contest-info', {relativeTo: this.route}]);
    this.router.navigate(
      [
        this.sports_id + "/" + this.league_id + "/my-league/contest-info",
        lineup_master_id,
        contest_id,
        collection.collection_master_id
      ],
      { queryParams: { is_live: true } }
    );
  }
  fillPlayGround(lineupDetails) {
    this.defPlayers = [];
    this.midPlayers = [];
    this.fwdPlayers = [];
    let formation = "";
    const playerStartPosition = this.utilityservice.playersStartPositions();
    let dfPosition = playerStartPosition["soccer"].DF,
      mfPosition = playerStartPosition["soccer"].MF,
      fwPosition = playerStartPosition["soccer"].FW;
    // If Sports is soccer and lineup list is empty set default player position
    if (!lineupDetails.length) {
      //  setDefaultMinMaxPosition();
      this.defaultEndPosition = this.utilityservice.playersDefaultEndPosotion(
        "soccer"
      );
    }

    this.setPlayersPosition();
    this.setDefendersPosition();
    if (!lineupDetails.length) {
      this.normalLineup = true; // Show normal lineup map
      this.turboLineup = false; // Hide turbo lineup map
    } else if (lineupDetails.length > 4) {
      this.normalLineup = true; // Show normal lineup map
      this.turboLineup = false; // Hide turbo lineup map
    } else if (lineupDetails.length === 4) {
      this.normalLineup = false; // Hide normal lineup map
      this.turboLineup = true; // Show turbo lineup map
    }

    if (lineupDetails.length > 4) {
      for (const player of lineupDetails) {
        player.player_role_in_team =
          player.captain === 1
            ? "captain"
            : player.captain === 2
              ? "vice-captain"
              : "";

        // Condition for set players position in map for soccer
        if (this.sports_id === 5) {
          if (player.position === "GK") {
            this.playersArr[0] = player;
            this.playerActive[0] = "active";
          }
          if (player.position === "DF") {
            this.playersArr[dfPosition] = player;
            // this.defPlayers[dfPosition] = player;
            this.defPlayers.push(player);
            this.playerActive[dfPosition] = "active";
            dfPosition++;
          }
          if (player.position === "MF") {
            this.playersArr[mfPosition] = player;
            // this.midPlayers[mfPosition] = player;
            this.midPlayers.push(player);
            this.playerActive[mfPosition] = "active";
            mfPosition++;
          }
          if (player.position === "FW") {
            this.playersArr[fwPosition] = player;
            // this.fwdPlayers[fwPosition] = player;
            this.fwdPlayers.push(player);
            this.playerActive[fwPosition] = "active";
            fwPosition++;
          }
        }
      }
      // console.log(this.defPlayers.length);
      // console.log(this.midPlayers.length);
      // console.log(this.fwdPlayers.length);
      if (
        this.defPlayers.length === 4 &&
        this.midPlayers.length === 3 &&
        this.fwdPlayers.length === 3
      ) {
        this.fwclass = "FW-4-3-3";
        this.defclass = "Def-4-3-3";
        this.midclass = "Mid-4-3-3";
        formation = "4-3-3";
        // this.utilityservice.setLocalStorage('formation', formation);
      } else if (
        this.defPlayers.length === 5 &&
        this.midPlayers.length === 3 &&
        this.fwdPlayers.length === 2
      ) {
        this.fwclass = "FW-5-3-2";
        this.defclass = "Def-5-3-2";
        this.midclass = "Mid-5-3-2";
        formation = "5-3-2";
        // this.utilityservice.setLocalStorage('formation', formation);
      } else if (
        this.defPlayers.length === 5 &&
        this.midPlayers.length === 4 &&
        this.fwdPlayers.length === 1
      ) {
        this.fwclass = "FW-5-4-1";
        this.defclass = "Def-5-4-1";
        this.midclass = "Mid-5-4-1";
        formation = "5-4-1";
        // this.utilityservice.setLocalStorage('formation', formation);
      } else if (
        this.defPlayers.length === 4 &&
        this.midPlayers.length === 5 &&
        this.fwdPlayers.length === 1
      ) {
        this.fwclass = "FW-4-5-1";
        this.defclass = "Def-4-5-1";
        this.midclass = "Mid-4-5-1";
        formation = "4-5-1";
        // this.utilityservice.setLocalStorage('formation', formation);
      } else if (
        this.defPlayers.length === 3 &&
        this.midPlayers.length === 4 &&
        this.fwdPlayers.length === 3
      ) {
        this.fwclass = "FW-3-4-3";
        this.defclass = "Def-3-4-3";
        this.midclass = "Mid-3-4-3";
        formation = "3-4-3";
        // this.utilityservice.setLocalStorage('formation', formation);
      } else if (
        this.defPlayers.length === 3 &&
        this.midPlayers.length === 5 &&
        this.fwdPlayers.length === 2
      ) {
        this.fwclass = "FW-3-5-2";
        this.defclass = "Def-3-5-2";
        this.midclass = "Mid-3-5-2";
        formation = "3-5-2";
        // this.utilityservice.setLocalStorage('formation', formation);
      } else if (
        this.defPlayers.length === 5 &&
        this.midPlayers.length === 3 &&
        this.fwdPlayers.length === 2
      ) {
        this.fwclass = "FW-5-3-2";
        this.defclass = "Def-5-3-2";
        this.midclass = "Mid-5-3-2";
        formation = "5-3-2";
        // this.utilityservice.setLocalStorage('formation', formation);
      }
      this.utilityservice.setLocalStorage("formation", formation);
    } else {
      lineupDetails.forEach((player, key) => {
        this.playersArr[key] = player;
        this.playerActive[key] = "active";
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
  onSelectTeam(myTeam, leagues, collections, selectedTeam?) {
    this.OnViewSelect.SelectedCollections = collections;
    this.OnViewSelect.selectedContest_id = leagues.contest_id;
    // this.OnViewSelect.selectedlineu_id = selectedTeam;

    // this.getTeamLineup(myTeam, leagues, collections);
    this.selectTeam(myTeam, leagues, collections);
  }
  selectTeam(myTeam, leagues, collections) {
    // console.log(myTeam.value, leagues);
    for (const team of leagues["teams"]) {
      //  console.log(team.team_name);
      if (team.team_name === myTeam.value) {
        //  console.log(team.team_name);
        this.getTeamLineup(team, leagues, collections);
      }
    }
  }
  fistItemInArray(contestListData) {
    let collections = { contests: [] };
    let leagues = { teams: [] };
    let leaguesteam = {};
    for (let i = 0; i <= contestListData.length; i++) {
      if (i === 0) {
        collections = contestListData[i];
        if (collections) {
          for (let j = 0; j <= collections.contests.length; j++) {
            if (i === 0) {
              leagues = collections.contests[i];
              for (let k = 0; k <= leagues.teams.length; k++) {
                if (i === 0) {
                  leaguesteam = leagues.teams[i];
                }
              }
            }
            //  console.log(collections, leagues, leaguesteam);
            this.getTeamLineup(leaguesteam, leagues, collections);
          }
        }
      }
    }
  }
  showMenu() {
    this.menu = !this.menu;
  }
  mobileContestInfo(contestId) {
    // console.log(contestId);
    if (this.toggledContest === contestId) {
      this.toggledContest = 0;
      this.mobileToggle = !this.mobileToggle;
    } else {
      this.toggledContest = contestId;
      this.mobileToggle = !this.mobileToggle;
    }
  }
  backToDetails() {
    this.btn = false;
    this.isDisabled = false;
    this.isPopulated = false;
  }
  s;

  getContestDetail(contest) {
    /* this.selectedCollection  = {};
        var param = {
            "contest_id": contest.contest_id,
            "contest_unique_id": contest.contest_unique_id,
        }
        this.service.api('fantasy/contest/get_contest_detail', param, 'POST', 'sport').then(function(response) {
           this.currentContest          = response.data;
            response.data.money_bag    = contest.money_bag;
            response.data.currentUser  = currentUser;
            response.data.selectedTab  =this.currentMatch;
            if(response.data.status == 2 || response.data.status == 3){
                response.data.match_status = "Completed";
            }else if(response.data.status == 0 && response.data.contest_start_status == 1){
                response.data.match_status = "Live";
            }else{
                response.data.match_status =this.currentMatch;
            }
  
  
           this.selectedCollection.collection_master_id = this.currentContest.collection_master_id;
            const  ContestDetailInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ContestDetailsModalTpl',
                windowClass: 'league-detail-popup right-side-modal-window',
                controller: 'ContestDetailsController',
                controllerAs: '$ctrl',
                appendTo: document.find('.modal-parent').eq(0),
                resolve: {
                    ContestDetails: function() {
                        return response.data;
                    },
                    selectedCollection: function() {
                        return this.selectedCollection;
                    }
                }
            });
            ContestDetailInstance.result.then(function(data) {
                if(data.type=='invite'){
                  // inviteContestInit(data.contest);
                } else {
                 // joinContest(this.currentContest);
                }
            }, function() {
  
            });
        }, function(error) {
          if (error['error']['global_error'] === 'Session key has expired') {
            this.message = error['error']['global_error'];
            this.router.navigate(['/']);
         }
        });*/
  }
}
