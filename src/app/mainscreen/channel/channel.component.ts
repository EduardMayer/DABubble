import { Component, Input } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',

  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {

  lastMessageTimestamp=0;

  constructor(public channelFirebaseService: ChannelFirebaseService) {
  }

  setLastMessageTimestamp(timestamp: number){
    this.lastMessageTimestamp=timestamp;
    console.log(timestamp);
  }

  channelMessages(){
    
  }


  /*
      if (currentChannel) {
        console.log(currentChannel.messages);
        this.messages = currentChannel.messages;
        //this.messages=JSON.parse(this.channelData.messages);
      }
  */
      




  
}