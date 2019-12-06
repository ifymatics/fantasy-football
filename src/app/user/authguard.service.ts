import { AuthloginService } from './authlogin.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,
   RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';



@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private service: AuthloginService, private router: Router ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   return this.service.isAuthenticated()
    .then(
      (authenticated: boolean) => {
      if (authenticated) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    });
   // return true;
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     return this.canActivate(route, state);
  }
// tslint:disable-next-line:eofline
}
