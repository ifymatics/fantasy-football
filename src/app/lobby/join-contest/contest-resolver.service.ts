import { LobbyService } from '../lobby.service';
import { AuthloginService } from '../../user/authlogin.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isUndefined } from 'util';

@Injectable({providedIn: 'root'})
export class ContestResolver implements Resolve<any> {
 constructor(private lobbyservice: LobbyService, private router: Router) {}
 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{}> | Promise<{}> | {} {
  if (this.lobbyservice.contest) {
    if (this.lobbyservice.league === null) {
    // this.router.navigate(['/5/league']);
    // return this.service.getComponentData();
    } else {
    // return this.lobbyservice.contest;
   // console.log(this.lobbyservice.contest);
    return this.lobbyservice.league;
    // sthis.router.navigate(['/']);
   }
  } /*else if (this.service.lineup) {
    if (this.service.lineup === null) {
     // console.log(this.service.lineup);
      this.router.navigate(['/5/lobby']);
      // return this.service.getComponentData();
      } else {
      return this.service.lineup;
       console.log(this.service.lineup);
       this.router.navigate(['/lineup']);
     }
  }*/
 }
}
