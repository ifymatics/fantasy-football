import { Component, OnInit } from '@angular/core';
import { LeaguesService } from '../../leagues.service';
import { PredictwinService } from '../../predictwin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-game',
  templateUrl: './manage-game.component.html',
  styleUrls: ['./manage-game.component.scss']
})
export class ManageGameComponent implements OnInit {
  leagues = [];
  constructor( private leaguesService: LeaguesService,
               private predictwinService: PredictwinService,
               private router: Router) { }

  ngOnInit() {
    this.fetchLeagues();
  }
  fetchLeagues() {
    this.leaguesService.fetchAllLeagues().subscribe(
      leagues => this.leagues = leagues
    );
  }
  onSelectLeague(id){
   
    if (this.router.url === "/predict-win/admin/manage-game/token") {
      this.predictwinService.fetchGame(id,'token').subscribe(
        data => {
          this.predictwinService.gamesEmitter.emit(data);
        }
      );

    } else { 
    this.predictwinService.fetchGame(id).subscribe(
      data => {
        this.predictwinService.gamesEmitter.emit(data); 
      }
    );
    }
   // console.log(id);
  }
}
