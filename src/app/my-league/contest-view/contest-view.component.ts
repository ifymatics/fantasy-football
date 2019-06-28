import { LeagueService } from "./../league.service";
import { UtilityService } from "./../../utility.service";
import { AuthloginService } from "src/app/user/authlogin.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "app-contest-view",
  templateUrl: "./contest-view.component.html",
  styleUrls: ["./contest-view.component.scss"]
})
export class ContestViewComponent implements OnInit {
  /* Fixtures properties starts */
@ViewChild("owlStage") owlStage: ElementRef;
@ViewChild("owlItem") owlItem: ElementRef;
widthOfOwlItem;
widthOfItem;
forwardCount = 0;
backwardCount = 0;
owlItems = document.getElementsByClassName("owl-item");
showLessFixturesBtn = true;
showMoreFixturesBtn = false;


/* games = [
  {id: 1, home: 'RBL', away: 'TSG', time: 'Mon, Feb 25-08:30 pm' },
  {id: 1, home: 'MUD', away: 'CHE', time: 'Mon, Feb 25-08:30 pm' },
  {id: 1, home: 'ARS', away: 'LIV', time: 'Mon, Feb 25-08:30 pm' },
  {id: 1, home: 'RBL', away: 'TSG', time: 'Mon, Feb 25-08:30 pm' },
  {id: 1, home: 'MUD', away: 'CHE', time: 'Mon, Feb 25-08:30 pm' },
  {id: 1, home: 'ARS', away: 'LIV', time: 'Mon, Feb 25-08:30 pm' }
];*/
/* Fixtures properties ends */
  chatbox = true;
  selected = "";
  contest = { status: 0, user_rank: "", contest_rank: "" };
  userRankList;
  posting = false;
  loadMorePosting = false;
  stateParams = {
    sports_id: 5,
    league_id: "",
    contest_id: "",
    lineup_master_id: "",
    collection_master_id: ""
  };
  userRank;
  contestData;
  contestListRank = [];
  contestListOffset = 0;
  collection_detail;
  isLoadMore = false;
  currentUser;
  session;
  selectedContest = this.stateParams.league_id;
  isLoading = false;
  lineupDetails = [];
  teamName = "";
  checkContest_id = [];
  btn = false;
  totalUserJoined = 0;
  selectedLineupMasterContetId = "";
  device = "";
  selectedLineUp = "";
  selectedLeague = "";
  selected_collection_start;
  userNameLabel;
  teamInfo: {
    is_turbo_lineup: number;
    collection_master_id: number;
    league_id: number;
    lineup_master_id: number;
    rank: "";
  };
  totalSalary = 0;
  substitutePlayerAllowed = 0;
  substituted_players;
  player_position;
  playersArr = [];
  message = "";
  isDisabled = false;
  isPopulated = false;
  fwclass = "";
  defclass = "";
  midclass = "";
  midPlayers = [];
  fwdPlayers = [];
  defPlayers = [];
  normalLineup = false;
  turboLineup = false;
  sports_id = 5;
  playerActive = {};
  defaultEndPosition;
  constructor(
    private service: AuthloginService,
    private router: Router,
    private route: ActivatedRoute,
    private utilityservice: UtilityService,
    private deviceService: DeviceDetectorService,
    private leagueservice: LeagueService
  ) {}

  ngOnInit() {
    // console.log(this.route.routeConfig);
    this.route.params.subscribe((params: ParamMap) => {
      this.stateParams.contest_id = params["contest_id"];
      this.stateParams.lineup_master_id = params["lineup_master_id"];
      this.stateParams.collection_master_id = params["collection_master_id"];
      // console.log(this.stateParams.contest_id);
      this.contestData = this.utilityservice.getLocalStorage("collection");
      // console.log(this.contestData);
    });
    if (this.utilityservice.checkLocalStorageStatus("user")) {
      const user = this.utilityservice.getLocalStorage("user");
      this.currentUser = user.user_profile;
      this.session = user.data.session_key;

      this.getContestRank();
    }
    for (let i = 0; i <= this.owlItems.length; i++) {
      return this.widthOfItem;
    }
  }
  getContestRank(offset?) {
    if (offset) {
      this.loadMorePosting = true;
    }
    const contest_id = this.stateParams.contest_id;
    const lineup_master_id = this.stateParams.lineup_master_id;

    this.posting = true;
    this.userRank = [];
    if (!offset) {
      this.contestListRank = [];
      offset = 0;
    }

    const param = {
      offset: offset,
      contest_id: contest_id,
      lineup_master_id: lineup_master_id,
      sports_id: this.stateParams.sports_id
    };
    this.service
      .api("fantasy/contest/get_contest_rank", param, "POST", this.session)
      .subscribe(
        response => {
          // console.log(response.data.contest.user_rank);
            console.log(param);
          this.contest = response.data.contest;
          this.userRank = this.contest.user_rank;
         // console.log(this.userRank[0]);
          // this.contestListRank            = this.contest.contest_rank;
          this.contestListRank = this.contestListRank.concat(
            this.contest.contest_rank
          );
          this.collection_detail = response.data.contest;
          this.collection_detail.match_list = response.data.contest.fixtures;
          this.contestListOffset = response.data.offset;
          this.isLoadMore = response.data.is_load_more;
          this.getTeamLineup(this.userRank[0]);
          this.posting = false;
          this.loadMorePosting = false;
         // this.fistItemInArray(this.userRank);
          if (!offset) {
            this.loadFireChat();
          }
        },
        error => {
           console.log(error);
           console.log(param);
          this.posting = false;
          // emitAlert.on(UtilityService.getErrorMessage(error), 'danger');
          // $state.go('root.league.init', { 'current_tab': 1 });
        }
      );
  }
  loadFireChat() {
    //fullPageLoader = true;
    /*firebase.auth().onAuthStateChanged(function(user) {
          if(!user){
           fireBaseLogin();
         }
         // Once authenticated, instantiate Firechat with the logged in user
         if (user) {
             $rootScope.fullPageLoader = false;
             this.my_profile= user;
            initChat(user);
         }
     });*/
  }
  getTeamLineup(lineup, league?, collection?) {
    this.teamName = lineup.team_name;
    this.isLoading = true;
    this.checkContest_id = [];
    this.btn = true;
    //  console.log(lineup);
    this.defPlayers = [];
    this.midPlayers = [];
    this.fwdPlayers = [];
    this.checkContest_id = [];
    this.checkContest_id.push(lineup.user_id);
  // console.log(this.checkContest_id);
    // console.log(this.device);
    this.totalUserJoined = league ? league.total_user_joined : 0;
    this.selectedLineupMasterContetId = lineup.lineup_master_contest_id;
    // this.teamInfo                = {is_turbo_lineup: 0};
    // this.lineupDetails           = [];
    this.selectedLineUp = lineup;
    this.selectedLeague = league;
    // this.groundLoading           = true;
    this.userNameLabel = lineup;
    // this.substitutePlayersArr    = [];
    // this.substituted_players     = [];
    // this.substitutePlayerAllowed = 0;
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
          // this.groundLoading = false;
          if (response.response_code === 200) {
            this.isLoading = false;
            this.lineupDetails = response.data.lineup;
           
            this.teamInfo = response.data.team_info;
           // console.log(this.teamInfo);
            this.teamInfo.collection_master_id =
              response.data.lineup[0].collection_master_id;
            this.teamInfo.league_id = response.data.lineup[0].league_id;
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
            //  console.log(this.playersArr);
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
          // this.groundLoading = false;
          // alert(UtilityService.getErrorMessage(error), 'danger');
          if (error["error"]["global_error"] === "Session key has expired") {
            this.message = error["error"]["global_error"];
            this.router.navigate(["/"]);
          }
          this.btn = false;
        }
      );
  }
  getContestDetail(contest) {
    // console.log(contest);
  }
  showChatbox() {
    this.chatbox = !this.chatbox;
  }
 /* showMoreFixtures() {
    this.forwardCount += 1;

    if (this.forwardCount === 1) {
      this.widthOfOwlItem = this.owlItem.nativeElement.offsetWidth;
    } else if (this.forwardCount > 1) {
      this.widthOfOwlItem += this.widthOfOwlItem;
    }

    this.owlStage.nativeElement.style.transform = `translate3d(-${
      this.widthOfOwlItem
    }px, 0px 0px)`;

    // console.log("Hello");
  }
  showLessFixtures() {
    this.backwardCount += 1;
    if (this.backwardCount === 1) {
      this.widthOfOwlItem = this.owlItem.nativeElement.offsetWidth;
    } else if (this.backwardCount > 1) {
      this.widthOfOwlItem -= this.widthOfOwlItem;
    }

    this.owlStage.nativeElement.style.transform = `translate3d(${
      this.widthOfOwlItem
    }px, 0px 0px)`;
  }*/
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
    // this.setDefendersPosition();
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
      //  console.log(this.defPlayers.length);
      //  console.log(this.midPlayers.length);
      //  console.log(this.fwdPlayers.length);
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
  fistItemInArray(contestListData) {
   // console.log(contestListData);
   let collections = {contests:[]};
    let leagues = { teams: [] };
    let leaguesteam = {};
    for (let i = 0; i <= contestListData.length; i++) {
      if (i === 0) {
        collections = contestListData[i];
      //  console.log(collections);
        for (let j = 0; j <= collections.contests.length; j++) {
          if (i === 0) {
            leagues = collections.contests[i];
            for (let k = 0; k <= leagues.teams.length; k++) {
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
  getCollectionDetail() {
    // this.collection_detail = {};
    const param = {
      collection_master_id: this.stateParams.collection_master_id,
      sports_id: this.sports_id
    };
    this.service
      .api("fantasy/lobby/get_collection_detail", param, "POST", this.session)
      .subscribe(
        (response: Response) => {
          // console.log(response["data"].collection);
          if (response["response_code"] === 200) {
            // Check match available or not
            if (!response["data"].match_list.length) {
              alert("Matches not available.");
              // $state.go('root.lobby.init');
              return false;
            }

            this.collection_detail = response["data"].collection;
            this.collection_detail["season_scheduled_date"] =
              response["data"].match_list[0].season_scheduled_date;
            this.collection_detail["today"] =
              response["data"].match_list[0].today;
            this.collection_detail["match_list"] = response["data"].match_list;
            // console.log( this.collection_detail['match_list']);
            // console.log( this.collection_detail);
           /* this.getLineupMasterData();
            this.getAllTeams();
            this.playerservice.setPlayersPosition();
            */
          }
        },
        (error: Error) => {
          if (error["error"]["global_error"] === "Session key has expired") {
            this.message = error["error"]["global_error"];
            this.router.navigate(["/"]);
          }
          // $state.go('root.lobby.init');
        }
      );
  }
   /* FIXTURES SLIDER STARTS */

showMoreFixtures() {
  this.forwardCount += 1;
  this.backwardCount = 0;

  if ((this.forwardCount === 1) && !(this.owlStage.nativeElement.style.transform !== "translate3d(0px, 0px, 0px)") ) {
    this.widthOfOwlItem = -this.owlItem.nativeElement.offsetWidth;
    // console.log(this.widthOfOwlItem);
  } else if ((this.forwardCount > 1) || ((this.forwardCount === 1) && (this.owlStage.nativeElement.style.transform !== "translate3d(0px, 0px, 0px)") )) {
    this.widthOfOwlItem -= this.owlItem.nativeElement.offsetWidth;
    //console.log('Stop');
  }

  this.owlStage.nativeElement.style.transform = `translate3d(${this.widthOfOwlItem}px, 0px, 0px)`;
  // console.log(this.widthOfOwlItem);

  if (
    this.owlStage.nativeElement.style.transform !==
    "translate3d(0px, 0px, 0px)"
  ) {
    this.showLessFixturesBtn = false;
  }



  if (!(this.owlItems[this.owlItems.length - 1].getBoundingClientRect().right > document.documentElement.clientWidth) && !(this.owlItems[this.owlItems.length - 1].getBoundingClientRect().right < document.documentElement.clientWidth) ) {
   // console.log("Hi Arinze!");
    this.showMoreFixturesBtn = true;
  }

  if ((this.owlItems[this.owlItems.length - 1].getBoundingClientRect().right < document.documentElement.clientWidth) ) {
   // console.log("Hello Arinze!");
    this.showMoreFixturesBtn = true;
  }


  return this.widthOfOwlItem;
}

showLessFixtures() {
 // console.log(this.widthOfOwlItem);

  this.forwardCount = 0;
  this.backwardCount += 1;

  this.widthOfOwlItem += this.owlItem.nativeElement.offsetWidth;

  this.owlStage.nativeElement.style.transform = `translate3d(${
    this.widthOfOwlItem
  }px, 0px, 0px)`;
  // console.log(this.widthOfOwlItem);

  if (
    this.owlStage.nativeElement.style.transform === "translate3d(0px, 0px, 0px)"
  ) {
    this.showLessFixturesBtn = true;
  }

  if (this.owlItems[this.owlItems.length - 1].getBoundingClientRect().right <  document.documentElement.clientWidth) {
    // console.log("Hiya Arinze!");
    this.showMoreFixturesBtn = false;
  }

  return this.widthOfOwlItem;
}
/* FIXTURES SLIDER ENDS */
}
