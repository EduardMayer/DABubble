import { Component } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss' , '../../styles.scss']
})
export class MainscreenComponent {

  channelOpen = true;
  threadOpen = true; 
  sideNavOpen = true; 

  seclectedChannel: string = "";
  channelData: Channel[] | undefined;

  constructor(public channelFirebaseService: ChannelFirebaseService) {
    this.selectChannel("Alt");
  }

  selectChannel(channelName: string) {
    this.seclectedChannel = channelName;
    this.channelFirebaseService.load("channelName", channelName);
  }
  
  /*
  EXAMPLE VALUES
  messageRef: string = "aSyrPGGxzgTZMjZxjJVB";
  messageRef2: string= "EO7EJSfbToZGXF7YL4cZ";
  */


  toggleSideNav(){
    this.sideNavOpen = !this.sideNavOpen; 
  }


}
