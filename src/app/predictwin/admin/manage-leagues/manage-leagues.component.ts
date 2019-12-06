import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LeaguesService } from '../../leagues.service';
 
@Component({
  selector: 'app-manage-leagues',
  templateUrl: './manage-leagues.component.html',
  styleUrls: ['./manage-leagues.component.scss']
})
export class ManageLeaguesComponent implements OnInit {
 leagueForm;
 leagues = [];
  constructor(private leaguesService: LeaguesService) { }

  ngOnInit() {
    this.leagueForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'id': new FormControl(null, [Validators.required]),
    });
    this.fetchAll();
  }
  cleateLeage() {
    const leagueForm = this.leagueForm.value;
    leagueForm['status'] = false;
   const leagues:[] = this.leaguesService.createLeague(this.leagueForm.value);
   // console.log(leagues);
  }
  fetchAll(){
   this.leaguesService.fetchAllLeagues()
   .subscribe(
     leagues => this.leagues = leagues // console.log(leagues)
   );
  }
  enableOrDisable(league, status){
  
  if(status){league['status']=false;}
  else league['status']=true;
 
  this.leaguesService.createLeague(league, league.id).then(data=>console.log('done'))
  }

}
