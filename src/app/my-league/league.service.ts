import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  message;
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
  // -----------------------------Live Substitution Params---------------------------------------
 remaining_salary_cap    = 0;
 substitutePlayerAllowed = 0;
 substitutePlayersArr    = [];
 undoBtn                 = {};
 substitutedData         = {};
 salary_cap              = 0;
 substituted_players  = [];
 session;
 playersMinMaxData       = {
      'GK': { max_player_per_position: '1', number_of_players: '1', position: 'GK' },
      'DF': { max_player_per_position: '5', number_of_players: '3', position: 'DF' },
      'MF': { max_player_per_position: '5', number_of_players: '3', position: 'MF' },
      'FW': { max_player_per_position: '3', number_of_players: '1', position: 'FW' }
  };

  constructor() { }
  getContestData (contestData) {
    this.contestListData = contestData;
  }
  getContestList() {
    if (this.contestListData.length > 0) {
      console.log(this.contestListData);
      return this.contestListData;
    } else {
      return;
    }
  }
}
