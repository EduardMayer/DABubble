import { Component, Input } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',

  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {

  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public userFirebaseService: UserFirebaseService
    ) {
    if(channelFirebaseService.selectedChannel){
      channelFirebaseService.loadChannelMessages(channelFirebaseService.selectedChannel.id);// to be changed to currentChannel
    }
    
  }











}