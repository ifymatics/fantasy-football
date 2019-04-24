import { AuthloginService } from './../../user/authlogin.service';
import { UtilityService } from './../../utility.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  contestListData = [];
  isLoading = false;
  device = '';
  isMobile = false;
  showNoPitch = false;
  currentUser;
  session;
  message = '';
  currentMatch;
  viewLiveRank                = false;
  viewCompletedRank ;
  isSelected = {};
  mobileDevice;
  constructor(private deviceService: DeviceDetectorService,
              private utilityservice: UtilityService,
              private service: AuthloginService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.mobileDevice = this.deviceService.isMobile();
    if (this.deviceService.isMobile()) {
      this.device = 'mobilePitch';
     // console.log(this.device);
      this.isMobile = true;
    } else if (this.deviceService.isDesktop) {
      this.device = 'desktopPitch';
       this.showNoPitch = false;
    }
      if (this.utilityservice.checkLocalStorageStatus('user')) {
        const user = this.utilityservice.getLocalStorage('user');
      this.currentUser      = user.user_profile;
      this.session = user.data.session_key;
      this.selectLeagueType(1);
      }
  }
  selectLeagueType(status) {
    this.isLoading = true;
   // console.log(status);
        // this.posting                     = true;
        this.isSelected                  = {};
        // this.lineupDetails               = [];
        // this.playersArr                  = [];
        // this.playerActive                = {};
        this.contestListData             = [];
        this.viewLiveRank                = false;
        this.viewCompletedRank           = false;
        this.currentMatch                = (status === 0) ? 'Upcoming' : ((status === 1) ? 'Live' : 'Complete');
        this.isSelected[this.currentMatch] = 'active';
        const param = {
            'status':  status,
            'sports_id':5 // this.sports_id,
            // 'league_id': 114 // this.league_id
        };
        this.service.api('fantasy/contest/get_collections_by_status', param, 'POST', this.session)
        .subscribe((response) => {
         // console.log(param);
          this.isLoading = false;
        //  this.posting       = false;
            //  this.groundLoading = false;
            response         = response.data;
            // console.log(response);
             if (!response.collections.length) {
                // this.fillPlayGround([]);
             }
            //  this.leagueservice.getContestData( response.collections);
             this.contestListData = response.collections;
            // console.warn(this.contestListData);
        }, error => {
          this.isLoading = false;
           // console.log(error);
         if (error['error']['global_error'] === 'Session key has expired') {
            this.message = error['error']['global_error'];
            this.router.navigate(['/']);
         }
            // this.posting = false;
        });
    }

}
