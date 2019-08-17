import { Component, OnInit } from '@angular/core';
import { LeaguesService } from 'src/app/predictwin/leagues.service';
import { PredictwinService } from 'src/app/predictwin/predictwin.service';

@Component({
  selector: 'app-manage-free',
  templateUrl: './manage-free.component.html',
  styleUrls: ['./manage-free.component.scss']
})
export class ManageTeamFreeComponent implements OnInit {
 freeGames = [];
 leagues  = [];
  constructor(private predictwinService: PredictwinService) { }

  ngOnInit() {
     this.predictwinService.gamesEmitter.subscribe(
       data => {
         if(data){
           this.freeGames = [];
           this.freeGames = data;
         }
       }
     );
   this.fetchAllFreeGames();
  }
  fetchAllFreeGames(){
    this.predictwinService.fetchAllGames().subscribe(
     data => {  this.freeGames = data; console.log(data);}
    );
  }
  
}
