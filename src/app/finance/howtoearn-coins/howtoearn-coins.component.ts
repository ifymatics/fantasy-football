import { UtilityService } from './../../utility.service';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-howtoearn-coins',
  templateUrl: './howtoearn-coins.component.html',
  styleUrls: ['./howtoearn-coins.component.scss']
})
export class HowtoearnCoinsComponent implements OnInit {
 message;
 isLoading = false;
 session;
 pointsSystemList = [];
 historyList = [];
 sort = { sort_field: '', sort_order: ''};
 posting = false;
 isLoadMore;
 offset  ;
 loadMorePosting = false;
 sort_field;
  constructor(private service: AuthloginService, private utilityservice: UtilityService) { }

  ngOnInit() {

   const user = this.utilityservice.getLocalStorage('user');
   this.session = user.data.session_key;
    this.getPointsSystem();
    this.getCoinHistory(0);
  }
  getPointsSystem() {
    const params = {
'items_perpage': 50,
'total_items': 0,
'current_page': 1,
'sort_order': 'DESC',
'sort_field': 'point_system_id'
};
this.isLoading = true;
this.service.api('fantasy/point_system/get_point_system', params, 'POST', this.session)
.subscribe((response) => {
        if (response.response_code === 200) {
            response = response.data;
            this.pointsSystemList = this.pointsSystemList.concat(response.result);
         console.log(response);
          }
        this.isLoading = false;
    }, (error) => {
      console.log(error);
       this.isLoading = false;
        if (error.global_error) {
         this.message =  error.global_error;
        }
    });

}
getCoinHistory(offset) {
  if (!offset) {
    this.historyList = [];
  }
  const params = {
        'sort_field': this.sort.sort_field,
        'offset': offset,
        'sort_order': this.sort.sort_order
      };
 this.posting = true;
 this.isLoading = true;
  this.service.api('user/point_system/earned_coins', params, 'POST', this.session)
  .subscribe((response) => {
      if (response.response_code === 200) {
          response       = response.data;
          console.log(response);
         this.isLoadMore  = response.is_load_more;
         this.historyList = this.historyList.concat(response.list);
         this.offset      = response.offset;
       }
     this.posting = false;
      this.isLoading = false;
  }, (error) => {
    console.log(error);
      this.posting = false;
      this.loadMorePosting = false;
      // emitAlert.on(UtilityService.getErrorMessage(error), 'danger');
  }) ;
}
sortHistory(sort_field) {
 this.sort.sort_order = (this.sort.sort_order === 'ASC') ? 'DESC' : 'ASC';
 this.sort_field = sort_field;
 this.getCoinHistory(0);
}
}
