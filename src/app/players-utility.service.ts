import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayersUtilityService {
  playersArr = [];
  playerActive = {};

  constructor() { }
  setPlayersPosition() {
    this.playersArr = [];
     this.playerActive = {};
    const playersOnMap = 13;
    for (let i = 0; i <= playersOnMap; i++) {
        this.playersArr.push({});
    }
     // console.warn( this.playersArr);
  }
}
