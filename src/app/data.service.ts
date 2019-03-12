import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private triggerEventMsg = new BehaviorSubject(false);
  triggerEventMsgObserv = this.triggerEventMsg.asObservable();

  constructor() { }

  triggerEvent(val: boolean) {
    // this.triggerEventMsgObserv.next(message)
  }
}
