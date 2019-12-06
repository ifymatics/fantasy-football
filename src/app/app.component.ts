import { Component } from '@angular/core';
import { UtilityService } from './utility.service';
import { AuthloginService } from './user/authlogin.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/Operators';
import { AnalyticsService } from "./analytics.service";
declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Analytics';
 // private analyticsService: AnalyticsService;
  constructor(private utilityservice: UtilityService, private service: AuthloginService, 
    private router: Router, analyticsService: AnalyticsService) {
      
     // this.analyticsService = analyticsService;
  const navEndEvents = router.events.pipe(filter(event=>event instanceof NavigationEnd));
  navEndEvents.subscribe((event: NavigationEnd)=>{
   
    gtag('config', 'UA-120815039-1', {'pagePath': event.urlAfterRedirects});
    //gtag('send', 'pageview');
  })
  }
  
    // I execute an action (that we're going to track).
  //   public doThat() : void {
 
  //     this.analyticsService.track(
  //         "do.that",
  //         {
  //             now: Date.now()
  //         }
  //     );

  // }


  // I execute an action (that we're going to track).
  // public doThis() : void {

  //     this.analyticsService.track(
  //         "do.this",
  //         {
  //             now: Date.now()
  //         }
  //     );

  // }
  logout() {
    //console.log('from eventemitter');
     this.service.logout();
   }
   // I get called once after the inputs have been bound for the first time.
   public ngOnInit() : void {
 
    // this.analyticsService.identify(
    //     "bennadel",
    //     {
    //         group: "admin"
    //     }
    // );

}
}
