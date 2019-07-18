import { SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { Injectable, EventEmitter } from '@angular/core';
// import {Moment} from 'moment';
// import moment = require('moment');

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  userBalance = new EventEmitter();
  logout = new EventEmitter<any>();

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

  convertToDateObject = function(date){
    return date; // moment(new Date(date)).toDate();
  };
  getTimestamp(dateTime) {
    // dateTime format: Sat, Jan 20-04:00pm
    const date = new Date(dateTime);
    const monthObj = {
      1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May',
      6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct',
      11: 'Nov', 12: 'Dec'
     };
     const hours = date.getHours() > 12 ?  this.addZero(date.getHours() - 12) : this.addZero(date.getHours());
     const mins = date.getMinutes() < 10 ? '0' + (date.getMinutes()) :  date.getMinutes() ;
     const am_pm = date.getHours() >= 12 ? 'PM' : 'AM';
    const NameObj = {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thur', 5: 'Fri', 6: 'Sat'};
    const formatted =  (NameObj[ date.getDay()] + ',' + ' ' + monthObj[date.getMonth() + 1]) + ' ' + date.getDate() + '-' +
    hours  + ':' + mins + ' ' + am_pm;
    return formatted;
  }
  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  alertHandler(type?) {
    let result = 'success';
    if (type === 'error') {
      return result = 'danger';
    }
    return result;
  }

}
