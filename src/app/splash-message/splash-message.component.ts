import { Component, OnInit, Input } from '@angular/core';
import { LeaguesService } from '../predictwin/leagues.service';

@Component({
  selector: 'app-splash-message',
  templateUrl: './splash-message.component.html',
  styleUrls: ['./splash-message.component.scss'],

})
export class SplashMessageComponent implements OnInit {
  @Input('page') page: string;
  infoObj = {
    imageUrl: '',
    msg: '',
    name: ''
  };
  message = ` Take advantage of this wonderful opportunity in our system and enjoy a wonderful fancoin earnings.
  Play and win for free and use your earned coins to purchase wonderful items of your choice in the fanshop`;
  image = "assets/image/bg-2.jpg";
  close = false;
  constructor(private leagueservice: LeaguesService) { }

  ngOnInit() {
    this.fetchInfoMessage();

  }
  fetchInfoMessage() {
    if (this.page) {
      // write a code to fetch the message from backend

      this.leagueservice.getInfoMessage(this.page).subscribe((data: { name: string, message: string, imageUrl: string }) => {
        this.infoObj.msg = (data.message != '' || data.message != null || data.message != undefined) ? data.message : this.message;
        this.infoObj.name = data.name;
        this.infoObj.imageUrl = (data.imageUrl !== '') ? data.imageUrl : this.image;
        this.close = false;
        //console.log(data)
      })
    }

  }
  getBackgroundImageUrl() {
    return (this.infoObj.imageUrl != '') ? `url(${this.infoObj.imageUrl})` : `url(${this.image})`;
  }
  onClose() {
    this.close = true;
  }
}
