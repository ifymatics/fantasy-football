import { Component, OnInit } from '@angular/core';
import { PredictwinService } from 'src/app/predictwin/predictwin.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LeaguesService } from 'src/app/predictwin/leagues.service';

@Component({
  selector: 'app-free-game',
  templateUrl: './free-game.component.html',
  styleUrls: ['./free-game.component.scss']
})
export class FreeGameComponent implements OnInit {
leagues = [];
games = [];
gameForm: FormGroup;
isLoading;
  constructor(private predictwinService: PredictwinService,
              private leaguesService: LeaguesService) { }

  ngOnInit() {
    // this.fetchFreeGames();
    
     this.gameForm = new FormGroup({
      'home': new FormControl(null,[Validators.required]),
      'away': new FormControl(null,[Validators.required]),
      'league_id': new FormControl(null,[Validators.required]),
      'date': new FormControl(null,[Validators.required]),
      'entry_fee': new FormControl(null,[Validators.required]),
      'prize': new FormControl(null,[Validators.required]),
     });
      this.fetchLeagues();
  }
  // fetchFreeGames() {
  //   this.predictwinService.fetchAllGames('').subscribe(
  //    data => this.games = data
  //   );
  //   }
    createGame() {
      this.isLoading = true;
      this.predictwinService.createGame(this.gameForm.value);
    }
    fetchLeagues() {
      this.leaguesService.fetchAllLeagues().subscribe(
        leagues => this.leagues = leagues
      );
    }
}
