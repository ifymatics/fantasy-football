import { md5 } from './../md5';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { UtilityService } from './../../utility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileDetails } from '../profile-details.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
 profileDetail: ProfileDetails;
 @ViewChild('changePassword') changePassword: ModalDirective;
 bankDetail         = {};
 bankDetailObj      = {};
 profileDetailObj;
 session;
 countryList        = [];
 stateList          = [];
 pan_card_file_type = '';
 user;
 currentUser;
 getOnlyYear;
 // myResponse      ={};
 myProfileDetail;
 changePasswordForm;
 passwordMatchError = null;
 value = '';
 value2 = '';
 posting = false;
 errors = '';
  league_detail = {'background_image': ''};

  constructor(private utilityservice: UtilityService,
    private service: AuthloginService) { }

  ngOnInit() {

    if (this.utilityservice.checkLocalStorageStatus('user')) {
      this.myProfileDetail = this.utilityservice.getLocalStorage('user');
      this.user =  this.myProfileDetail;
      this.currentUser = this.user.data.user_profile;
     this.session = this.user.data.session_key;
     }
     this.getMyProfileDetail();
     this.changePasswordForm = new FormGroup({
      'old_password': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required),
      'confirmpassword': new FormControl(null, Validators.required),
    });
  }
  getMyProfileDetail(isProfileUpdate?) {
 //  this.profileDetail = {};
    this.bankDetail    = {};
    const reqParams    = {};
    this.service.api('user/my_profile/get_my_profile', reqParams, 'POST', this.session)
    .subscribe((response) => {
        if (response.response_code === 200) {
         // console.log(response);
            response                = response.data;
            this.profileDetail        = response.user_profile;
            this.bankDetail           = response.user_bank_detail;
            this.bankDetailObj        = response.user_bank_detail;
            this.profileDetailObj     = response.user_profile;
            this.getAge( this.profileDetailObj.dob);
            this.profileDetailObj.dob = (this.profileDetailObj.dob) ?
            this.utilityservice.convertToDateObject(this.profileDetailObj.dob) : '';
            this.utilityservice.checkLocalStorageStatus('profileDetails') ?
            this.utilityservice.clearLocalStorage('profileDetails') : '';
            this.utilityservice.setLocalStorage('profileDetails', response.user_profile);
             this.profileDetailObj.phone_no = response.user_profile.phone_no;
            if (this.profileDetail.pan_image) {
                this.getFileProperties(this.profileDetail.pan_image);
            }
            if ( !isProfileUpdate && this.profileDetailObj.master_country_id) {
                this.getStatesByCounty(this.profileDetailObj.master_country_id);
            }
        }

    }, (error) => {
        if (error.global_error) {
           // emitAlert.on(error.global_error, 'danger');
        }
    });
}
getFileProperties(imageUrl) {
  const  imageNameArr                   = imageUrl.split('/'),
  pan_card_image                     = imageNameArr[imageNameArr.length - 1];
  this.profileDetailObj.pan_image_name = pan_card_image;
  this.profileDetailObj.pan_image      = imageUrl;
  this.pan_card_file_type              = pan_card_image.slice((pan_card_image.lastIndexOf(".") - 1 >>> 0) + 2);
  this.pan_card_file_type              = this.pan_card_file_type.toLowerCase();
}
getCounty() {
 this.countryList = [];
  const reqParams = {};
  this.service.api('user/my_profile/get_country_list', reqParams, this.session)
  .subscribe((response) => {
      if (response.response_code === 200) {
          response = response.data;
         this.countryList = response.country_list;

      }
  }, (error) => {
      // emitAlert.on(error.global_error, 'danger');
  });
}
getStatesByCounty(country_id) {
  this.stateList  = [];
  const reqParams = { master_country_id: country_id };
  this.service.api('user/my_profile/get_state_list', reqParams, this.session)
  .subscribe((response) => {
      if (response.response_code === 200) {
          response     = response.data;
          this.stateList = response.state_list;
      }
  }, function(error) {
      // emitAlert.on(error.global_error, 'danger');
  });
}
uploadProfilePicture(file) {
  if (file) {
      const sizeInMB = file[0].size / (1024 * 1024);
      // Condition for check file max size
      if (sizeInMB > 4) {
         // emitAlert.on(MessageService.getMessage('profile_pic_max_size'), 'danger');
          return false;
      }
      const fileType = file[0].type;
      if (fileType.toLowerCase() === 'image/png' || fileType.toLowerCase() === 'image/jpg' || fileType.toLowerCase() === 'image/jpeg') {
          this.myProfileDetail = this.utilityservice.getLocalStorage('user');
          const reqParams = { userfile: file[0] };
          this.service.multipartApi('user/my_profile/do_upload', reqParams, 'user').then(function(response) {
              if (response.response_code === 200) {
                  response                              = response.data;
                  this.profileDetail.image                = response.image_path;
                  this.myProfileDetail.user_profile.image = response.image_path;
                 //  emitAlert.on(MessageService.getMessage('profile_pic_updated'), 'success');
                  // angular.element("#profilePic")[0].value = '';
              }
              this.posting = false;
          }, function(error) {
              this.posting = false;
             //  emitAlert.on((error.error.userprofile)?error.error.userprofile
             // : MessageService.getMessage('profile_pic_allowed'), 'danger');
          });
      } else {
          // emitAlert.on(MessageService.getMessage('profile_pic_allowed'), 'danger');
      }
  }
}
getAge (year) {
  const d = new Date(year);
  const date = new Date().getFullYear();
  this.getOnlyYear = date - d.getFullYear();
  console.log(date - this.getOnlyYear);
}
onChangePassword() {
  let  apiUrl = '';
  let changePasswordObj = { old_password: '', password: '', }
  if (this.changePasswordForm.value.password !==
     this.changePasswordForm.value.confirmpassword) {
   this.passwordMatchError = 'The new passwords must match';
  }
  changePasswordObj.password = md5(this.changePasswordForm.value.password);
  if (this.profileDetail.is_password_set) {
    changePasswordObj.old_password = md5(this.changePasswordForm.value.old_password);
    apiUrl = 'user/my_profile/change_password';
} else {
    apiUrl = 'user/my_profile/add_password';
}
this.service.api(apiUrl, changePasswordObj, 'POST', this.session)
.subscribe((response) => {
  if (response.response_code === 200) {
    this.changePassword.hide();
   alert('successfullly updated');
      // emitAlert.on(response.message, 'success');
  }
  this.posting = false;
}, (error) => {
  if (this.profileDetail.is_password_set) {
      this.errors = error.error;
  } else {
     //  emitAlert.on(error.global_error, 'danger');
  }
  this.posting = false;
});

}
onType(event: string) {
  this.value = event;
// console.log(this.value);
if (this.value !== '') {
  this.changePasswordForm.value.confirmpassword.setError({'The new passwords must match': true});
}
}

}
