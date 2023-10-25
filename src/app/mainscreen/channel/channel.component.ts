import { Component, Input } from '@angular/core';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',

  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {
  @Input() channelData: Channel | undefined;
  messages: string[] = [];

  constructor() {
   

    setTimeout(()=>{
      console.log(this.channelData);
      console.log(this.messages);

      if (this.channelData) {
        console.log(this.channelData.messages);
        this.messages=this.channelData.messages;
        //this.messages=JSON.parse(this.channelData.messages);
      }
    },1000)
  }
}