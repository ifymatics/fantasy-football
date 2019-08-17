import { Component, OnInit } from '@angular/core';
import { PredictwinService } from 'src/app/predictwin/predictwin.service';

@Component({
  selector: 'app-manage-token',
  templateUrl: './manage-token.component.html',
  styleUrls: ['./manage-token.component.scss']
})
export class ManageTeamTokenComponent implements OnInit {
  dropdownToggle = false;
  tokenGames = [];
 leagues  = [];
  constructor(private predictwinService: PredictwinService) { }

  ngOnInit() {
     this.predictwinService.gamesEmitter.subscribe(
       data => {
         if(data){
           this.tokenGames = [];
           this.tokenGames = data;
         }
       }
     );
   this.fetchAllFreeGames();
  }
  fetchAllFreeGames(){
    this.predictwinService.fetchAllGames('token').subscribe(
     data => this.tokenGames = data
    );
  }
  toggleDropdown(){
    this.dropdownToggle = !this.dropdownToggle;
  }

}
