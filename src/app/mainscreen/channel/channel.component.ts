import { Component } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { IfChangedService } from 'src/services/if-changed-service.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  providers: [IfChangedService] // Provide the service at the component level
})
export class ChannelComponent {
  messageTime: string = "";
  messagePath: string = "";

  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public userFirebaseService: UserFirebaseService
  ) {
    if (channelFirebaseService.selectedChannel) {
      channelFirebaseService.loadChannelMessages(channelFirebaseService.selectedChannel.id);// to be changed to currentChannel
      this.messagePath=`channels/${channelFirebaseService.selectedChannel.id}/messages/`;
    }
  }

  getMessageTime(message: Message) {
    const currentDay = this.formatDateToDmy(new Date());
    const messageDmy = this.formatDateToDmy(new Date(message.timestamp));
    if (currentDay == messageDmy) {
      return "heute";
    } else {
      return messageDmy;
    }
  }

  formatDateToDmy(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');      // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (add 1 because months are zero-based) and pad with leading zero if necessary
    const year = date.getFullYear();                              // Get year
    return `${day}.${month}.${year}`;
  }

  openChannelUserPopup() {

  }

  userOnCurrentChannel: any = [];

  loadallChannelusers() {
    this.userFirebaseService.loadedUsers.forEach(user => {
    
      user.channels.forEach(channel => {
        debugger;

        console.log('channel of the user is', channel);
        console.log('now selected channel is', this.channelFirebaseService.selectedChannel?.channelName);


        if(channel === this.channelFirebaseService.selectedChannel?.channelName) {
          this.userOnCurrentChannel.push(user);
        }

        
      });

      console.log(user);
    });
    console.log('all users fir in chasnnechannel', this.userOnCurrentChannel);
    
  }

}
