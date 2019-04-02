import { SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private lstorage: LocalStorageService, private sessionStorage: SessionStorageService) { }
  setLocalStorage(index, data) {
     this.lstorage.store(index, data);
    // localStorage.setItem(index, JSON.stringify(data));
}
getLocalStorage(index) {
 if (this.lstorage.retrieve(index)) {

      return this.lstorage.retrieve(index);
  } else {
       return false;
   }
}
getAccessToken(index) {
  if (localStorage[index]) {
      return localStorage[index]['session_key'];
  } else {
      return false;
  }
}
clearLocalStorage(index) {
  // localStorage.removeItem('user');
   this.lstorage.clear(index);
}
clearAllLocalStorage() {
  localStorage.$reset();
}
checkLocalStorageStatus(key) {
  if (this.getLocalStorage(key)) {
      return true;
  } else {
      return false;
  }
}
setSession(index, data) {
  this.sessionStorage.store(index, data);
 // sessionStorage.setItem(index, JSON.stringify(data));
}
clearSession(index) {
  this.sessionStorage.clear(index);
  // sessionStorage.removeItem(index);
}
currentDateTime() {
  const dateTime = new Date().toLocaleString();
  return dateTime;
}
filterArr(data, key, val) {
  const result = data.filter((obj) => {
    return val === obj[key];
  });
  return result;
}
playersDefaultEndPosotion (sport) {
  const sportsTeam =  {
    'soccer': { 'GK': 0, 'DF': 5, 'MF': 10, 'FW': 13 }
    };
  return sportsTeam[sport];
}
playersStartPositions = function(sport?) {
  const playersStartPositions =  {'soccer': {'GK': 0, 'DF': 1, 'MF': 6, 'FW': 11}};
  return (sport) ? playersStartPositions[sport] : playersStartPositions;
};
getPlayersAbbriviation () {
  const playerAbbrs =  {
    'GK': 'goalkeeper',
    'FW': 'forward',
    'MF': 'midfielder',
    'DF': 'defender'
  };
  return playerAbbrs;
}
findObjPosition(data, key, val) {
  const result =  data.map(x => x[key] ).indexOf(val);
  return result;
}
 isAbleToJoinContest(user_balance, entry_fee) {
      entry_fee = Number(entry_fee);
      let calBonusFees = 0,
      isAllow = false;
      const entry_fee_ten_percentage = (entry_fee * 10 / 100),
      bonus_amount     = Number(user_balance.bonus_amount),
      real_amount      = Number(user_balance.real_amount),
      winning_amount   = Number(user_balance.winning_amount),
      calWinningAmt    = (winning_amount * 90 / 100);

      if (entry_fee_ten_percentage <= bonus_amount) {
          calBonusFees = entry_fee_ten_percentage;
      } else {
          calBonusFees = bonus_amount;
      }
      if (calBonusFees + real_amount + winning_amount >= entry_fee) {
          isAllow = true;
      }
      return isAllow;
  }


}
