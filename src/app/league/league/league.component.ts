
import { UtilityService } from './../../utility.service';
import { AuthloginService } from './../../user/authlogin.service';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/Operators';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit {
  leagueList      = [];
  private session;
  clicker = '';
  message = '';
  messageCss;
  sports_id;
  isLoading = false;
  showReload = false;
  onAnimate = false;
  subscription;
// data = {sports_id: 5};
data: {sports_id: number};
  constructor(private router: Router, private service: AuthloginService, private utilityService: UtilityService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ) .subscribe(
      () => {window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(window.scrollY);
    }
    );
    this.isLoading = true;
   // this.service.isLoggedIn = this.utilityService.checkLocalStorageStatus('user');
    /*this.data = {
      sports_id: this.route.snapshot.paramMap['id']
    };*/
    this.route.params.subscribe(
      (param: Params) => {
        this.data = {sports_id: +param['id']};
        this.sports_id = +param['id'];
      }
    );
     this.session =  this.utilityService.getLocalStorage('user').data.session_key ;
    // console.log(this.session);
  this.getSportsLeagues();
  }
  getSportsLeagues(fromDOM?) {
    this.service.api('fantasy/sl_lobby/get_sport_leagues', this.data, 'post', this.session)
    .subscribe(data => {
      this.isLoading = false;
    // console.log(data);
    this.leagueList = data['data'].result;
 // console.log(this.leagueList);
 },
   error => {
    // console.log(error);
      this.isLoading = false;
      this.showReload = true;
      if (error["error"]["global_error"] === "Session key has expired") {
        this.message = error["error"]["global_error"];
        this.messageCss = this.utilityService.alertHandler('error');
        this.router.navigate(["/"]);
      }
     }
 );
  }
playNow(league, i) {
  this.onAnimate = true;
  // console.log(league);
  this.utilityService.setLocalStorage('league', league) ;
 setTimeout(() =>  this.router.navigate([this.sports_id + '/' + league.league_id + '/lobby']) , 500);
 // console.log(league.league_id);
}
}
