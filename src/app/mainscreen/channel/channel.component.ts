import { Component, Input } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',

  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {
  messages: string[] = [];
  channelInstance: any;

  constructor(public channelFirebaseService: ChannelFirebaseService) {
    
    setTimeout(()=>{
      //console.log('here is channeldata', this.channelData);
      //console.log('here are messages', this.messages);
       //this.channelInstance=this.channelFirebaseService.currentChannel;
       //this.messages=this.channelFirebaseService.currentChannel.messages;
       //console.log(this.channelInstance);
    },2000)
  }


  /*
      if (currentChannel) {
        console.log(currentChannel.messages);
        this.messages = currentChannel.messages;
        //this.messages=JSON.parse(this.channelData.messages);
      }
  */
      




  
}