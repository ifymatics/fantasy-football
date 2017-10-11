import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }
  setLocalStorage(index, data) {
    localStorage.setItem(index, JSON.stringify(data));
}
getLocalStorage(index) {
  if (localStorage[index]) {
      return localStorage[index];
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
  delete localStorage[index];
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
  sessionStorage.setItem(index, data);
}
}
