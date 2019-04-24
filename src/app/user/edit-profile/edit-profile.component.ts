import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityService } from './../../utility.service';
import { ProfileDetails } from './../profile-details.model';
import { Component, OnInit } from '@angular/core';
import { AuthloginService } from '../authlogin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileDetail: ProfileDetails;
  session;
  isDisabled = true;
  myProfileDetail;
  editForm;
  stateList = [];
  countryList = [];
  editError;
  updateProfileBtn = false;
  constructor(private service: AuthloginService,
     private utilityservice: UtilityService,
     private router: Router) { }

  ngOnInit() {
    if (this.utilityservice.checkLocalStorageStatus('user')) {
      this.myProfileDetail = this.utilityservice.getLocalStorage('user');
      this.session = this.myProfileDetail.data.session_key;
      this.profileDetail = this.utilityservice.getLocalStorage('profileDetails');
      // this.getCounty();
    }
    this.getCounty();
    this.editForm  = new FormGroup({
      'first_name': new FormControl(this.profileDetail.first_name, Validators.required),
      'last_name': new FormControl(this.profileDetail.last_name, Validators.required),
      'email': new FormControl({value: this.profileDetail.email, disabled: true}, [Validators.required, Validators.email]),
      'user_name': new FormControl({value: this.profileDetail.user_name, disabled: true}, Validators.required),
      'dob': new FormControl( this.profileDetail.dob, Validators.required),
      'address': new FormControl( this.profileDetail.address),
      'phone_no': new FormControl( this.profileDetail.phone_no, Validators.required),
      'gender': new FormControl(this.profileDetail.gender),
      'master_country_id': new FormControl( this.profileDetail.master_country_id),
      'master_state_id': new FormControl( null),
      'city': new FormControl( this.profileDetail.city),
      'zip_code': new FormControl( this.profileDetail.zip_code),
      'pan_no':  new FormControl( this.profileDetail.pan_no)
    });
  }
  deleteProfileImage() {
    this.service.api('user/my_profile/remove_profile_image', {}, this.session)
    .subscribe((response) => {
        if (response.response_code === 200) {
            this.profileDetail.image                = '';
            this.myProfileDetail.user_profile.image = '';
            // emitAlert.on(response.message, 'success');
        }
    }, function(error) {
       //  emitAlert.on(error.global_error, 'danger');
    });

}
getStatesByCounty(country_id) {
  // console.log(country_id.toString());
 this.stateList  = [];
  const reqParams = { master_country_id: country_id };
  this.service.api('user/my_profile/get_state_list', reqParams, 'post', this.session)
  .subscribe((response) => {
   // console.log(response);
      if (response.response_code === 200) {
          response     = response.data;
          this.stateList = response.state_list;
      }
  }, (error) => {

    // console.log(error);
    // console.log(reqParams);
      // emitAlert.on(error.global_error, 'danger');
  });
}
getCounty() {
 this.countryList = [];
  const reqParams = {};
  this.service.api('user/my_profile/get_country_list', reqParams, '', this.session)
  .subscribe((response) => {
      if (response.response_code === 200) {
        // console.log(response);
          response = response.data;
         this.countryList = response.country_list;

      }
  }, (error) => {
    // console.log(error);
      // emitAlert.on(error.global_error, 'danger');
  });
}
updateProfile() {
  if (this.profileDetail.phone_no !== null && this.profileDetail.phone_no !== this.editForm.value.phone_no) {
    alert('You are not allowed to alter your phone number');
    this.updateProfileBtn = false;
     return false;
  }
  // console.log(this.editForm);
     this.updateProfileBtn = true;

      this.service.api('user/my_profile/update_profile', this.editForm.value, 'post', this.session)
      .subscribe( (response) => {
          if (response.response_code === 200) {
           // console.log(response);
              const responseData = response.data.user_profile;
             // emitAlert.on(response.message, 'success');
             this.updateLocalStorage(responseData); // Update local storage
             setTimeout(() => {
               // $state.go('root.profile.init');
                this.router.navigate(['profile']);
             }, 1000);

          }
         this.updateProfileBtn = false;
      }, (error) => {
        this.editError = error.error.error ;
        // console.log(error);
         this.updateProfileBtn = false;
      });

}
updateLocalStorage(data) {
 const  userDetail = this.myProfileDetail.data.user_profile;
// console.log( userDetail);
 Object.keys(userDetail).forEach( (objKey) => {
      if (data[objKey] === null) {
          userDetail[objKey] = data[objKey];
          if (objKey === 'dob') {
              // console.log(userDetail[objKey]);
          }
      }
  });

}

}
