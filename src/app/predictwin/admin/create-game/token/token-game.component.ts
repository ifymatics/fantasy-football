import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { PredictwinService } from 'src/app/predictwin/predictwin.service';
import { LeaguesService } from 'src/app/predictwin/leagues.service';
import { UtilityService } from 'src/app/utility.service';
import { Router } from '@angular/router';

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
  session;
  userId;
  error;
  tag;
  adminIds = ['1','2','3','4','6','28'];
  constructor(private predictwinService: PredictwinService,
              private leaguesService: LeaguesService, private utils: UtilityService, private router:Router) { }
  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    // if(!this.adminIds.includes(this.userId)){  this.router.navigate(['/home']);}
    // this.fetchTokenGames();
    this.fetchAllLeagues();
     this.tokenGameForm = new FormGroup({
      'title': new FormControl(null,[Validators.required]),
      'league_id': new FormControl(null,[Validators.required]),
      'entry_fee': new FormControl(null,[Validators.required]),
      'prize': new FormControl(null,[Validators.required]),
      'date': new FormControl(null,[Validators.required]),
       'games': new FormArray([])
     });
  }
  createFormArray() {
  
    const formGroup = new FormGroup({
      'home': new FormControl(null,[Validators.required]),
      'away': new FormControl(null,[Validators.required]),
      // 'date': new FormControl(null,[Validators.required]),
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
       //console.log(this.tokenGameForm.value);
       let tokenForm = this.tokenGameForm.value;
       tokenForm['dateCreated'] = Date.now();
       tokenForm.date = Date.parse(tokenForm.date);
      this.predictwinService.createGame(tokenForm, 'token').then(
        data =>{ this.tokenGameForm.reset(); this.error ="Token game created successfully", this.tag = 'success';}
      )
    }
    fetchAllLeagues() {
      this.leaguesService.fetchAllLeagues(true).subscribe(
        leagues => this.leagues = leagues
      );
    }
    closeAlert(){
      this.error = null;
    }
}
