import { Component } from '@angular/core';
import { Channel } from 'src/models/channel.class';
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
  channelData: Channel[];

  constructor(public channelFirebaseService: ChannelFirebaseService,public userFirebaseService: UserFirebaseService) {
    this.selectChannel("Alt");
    this.channelData = channelFirebaseService.loadedChannels;
    console.log(this.userFirebaseService.currentUser);
  }

  selectChannel(channelName: string) {
    this.seclectedChannel = channelName;
    this.channelFirebaseService.load("channelName", channelName);
  }

  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }


}
