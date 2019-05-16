import { Component, OnInit, Input } from '@angular/core';
class League {
  background_image: string;
  image: string;
  is_promote: string;
  league_abbr: string;
  league_id: string;
  league_logo: string;
  league_name: string;
  league_schedule_date: string;
  league_uid: string;
  max_player_per_team: string;
  show_global_leaderboard: string;
  sponsor_logo: string;
  status: string;
}
@Component({
  selector: 'app-single-leaderboard',
  templateUrl: './single-leaderboard.component.html',
  styleUrls: ['./single-leaderboard.component.scss']
})
export class SingleLeaderboardComponent implements OnInit {
@Input ('leag') leag: League;
  constructor() { }

  ngOnInit() {
  }
onClick() {
  console.log(this.leag.league_abbr);
}
}
