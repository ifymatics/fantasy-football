import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { PredictwinService } from 'src/app/predictwin/predictwin.service';
import { LeaguesService } from 'src/app/predictwin/leagues.service';

@Component({
  selector: 'app-token-game',
  templateUrl: './token-game.component.html',
  styleUrls: ['./token-game.component.scss']
})
export class TokenGameComponent implements OnInit {
  tokenGames;
  tokenGameForm;
  isLoading = false;
  games;
  leagues = [];
  constructor(private predictwinService: PredictwinService,
              private leaguesService: LeaguesService) { }
  ngOnInit() {
    // this.fetchTokenGames();
    this.fetchAllLeagues();
     this.tokenGameForm = new FormGroup({
      'title': new FormControl(null,[Validators.required]),
      'league_id': new FormControl(null,[Validators.required]),
      'entry_fee': new FormControl(null,[Validators.required]),
      'prize': new FormControl(null,[Validators.required]),
       'games': new FormArray([])
     });
  }
  createFormArray() {
  
    const formGroup = new FormGroup({
      'home': new FormControl(null,[Validators.required]),
      'away': new FormControl(null,[Validators.required]),
      'date': new FormControl(null,[Validators.required]),
    });
    (<FormArray>this.tokenGameForm.get('games')).push(formGroup);
  }
  destroyFormArray(index){
    (<FormArray>this.tokenGameForm.get('games')).removeAt(index);
  }
  fetchTokenGames() {
    this.predictwinService.fetchAllGames('token').subscribe(
     data => this.tokenGames = data
    );
    }
    createGame() {
      this.isLoading = true;
      // console.log(this.gameForm.value);
      this.predictwinService.createGame(this.tokenGameForm.value, 'token');
    }
    fetchAllLeagues() {
      this.leaguesService.fetchAllLeagues().subscribe(
        leagues => this.leagues = leagues
      );
    }
}
