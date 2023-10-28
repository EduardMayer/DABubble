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
export class MainscreenComponent implements OnInit {

  channelOpen = true;
  threadOpen = true;
  sideNavOpen = true;

  seclectedChannel: string = "";
  channelData: Channel[];

  constructor(public channelFirebaseService: ChannelFirebaseService,public userFirebaseService: UserFirebaseService , private authService: AuthFirebaseService) {
    this.selectChannel("Alt");
    this.channelData = channelFirebaseService.loadedChannels;
    console.log(this.userFirebaseService.currentUser);
  }

  ngOnInit(): void {
    
  }

  selectChannel(channelName: string) {
    this.seclectedChannel = channelName;
    this.channelFirebaseService.load("channelName", channelName);
  }

  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }


}
