import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  contestListData = {contest: {}};
  constructor() { }
  getContestDataOnviewNavigate (contestData: {}) {
    this.contestListData.contest = {};
    if (contestData !== null) {
      this.contestListData.contest = contestData;
    }
    console.log(this.contestListData.contest);
  }
  getContestData() {
    if (this.contestListData.contest !== {}) {
      console.log(this.contestListData);
      return this.contestListData;
    } else {
      return;
    }
  }
}
