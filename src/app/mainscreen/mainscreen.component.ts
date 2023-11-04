import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss', '../../styles.scss']
})
export class MainscreenComponent {

  channelOpen = true;
  threadOpen = true;
  sideNavOpen = true;

  seclectedChannel: string = "";

  constructor(public channelFirebaseService: ChannelFirebaseService, public userFirebaseService: UserFirebaseService, private authService: AuthFirebaseService) {
    console.log("here");
    setTimeout(() => {
      if (this.userFirebaseService.currentUser.id) {
        this.channelFirebaseService.load(this.userFirebaseService.currentUser.id);
      }
      console.log(this.userFirebaseService.currentUser.id);
      setTimeout(() => {
        this.channelFirebaseService.loadedChannels;
      }, 2000);
    }, 2000);
  }


  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }


}
