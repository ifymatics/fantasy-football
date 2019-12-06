import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from '../models/app-user';
import { switchMap } from 'rxjs/Operators';
import { UserService } from './user.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
// @Injectable()
export class AuthService {

  user$: Observable<firebase.User>;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth, 
    private route: ActivatedRoute) { 
    this.user$ = afAuth.authState;    
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    
    // this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() { 
    this.afAuth.auth.signOut();
  }

  get appUser$() : Observable<AppUser> {
    return this.user$
      .pipe(switchMap((user): Observable<AppUser| null> => {
        if (user) {return this.userService.get(user.uid); }
        return;
     // return Observable.if(null);
      }));    
  }
}
