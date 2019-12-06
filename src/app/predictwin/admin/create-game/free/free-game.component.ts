import { Component, OnInit } from '@angular/core';
import { PredictwinService } from 'src/app/predictwin/predictwin.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LeaguesService } from 'src/app/predictwin/leagues.service';
import { UtilityService } from 'src/app/utility.service';
import { Router } from '@angular/router';

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
session;
  userId;
  adminIds = ['1','2','3','4','6','28'];
  constructor(private predictwinService: PredictwinService,
              private leaguesService: LeaguesService,
              private utils: UtilityService, private router:Router) { }

  ngOnInit() {
    // this.fetchFreeGames();
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    // if(!this.adminIds.includes(this.userId)){  this.router.navigate(['/home']);}
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
      const gameForm = this.gameForm.value;
      gameForm['dateCreated'] = Date.now();
     gameForm.date = Date.parse(gameForm.date);
      this.predictwinService.createGame(gameForm).then(done=>this.gameForm.reset());
    }
    fetchLeagues() {
      this.leaguesService.fetchAllLeagues(true).subscribe(
        leagues => {this.leagues = leagues; }
      );
    }
    
}
