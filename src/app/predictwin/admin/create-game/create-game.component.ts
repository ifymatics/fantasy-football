import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PredictwinService } from '../../predictwin.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {
  gameForm;
  leagues = [];
  constructor(private predictwinService: PredictwinService) { }

  ngOnInit() {
   // this.fetchLeagues();
  }
//    fetchLeagues(){
//  this.predictwinService.fetchAllLeagues().subscribe(
//   data => {this.leagues = data;
//            console.log(this.leagues);
//           }
//    );

//  }
}
