import { Component, Input } from '@angular/core';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent {
  @Input() channel: any; //Channel, Chat, Thread

  message = new Message();

  constructor(
    private userFirebaseService: UserFirebaseService,
    public channelFirebaseService: ChannelFirebaseService
  ) {

  }

  async createMessage() {
    this.message.content;
    this.message.timestamp = Date.now();

    this.message.autorId = this.userFirebaseService.currentUser.id;
    this.message.avatarSrc = this.userFirebaseService.currentUser.avatar;
    if (!this.message.autorId) {
      this.message.autorId = "";
    }

    if (!this.message.avatarSrc) {
      this.message.avatarSrc = "assets/img/avatar/avatar1.svg";
    }

    console.log(this.message.avatarSrc = "./assets/img/avatar/avatar1.svg");

    //let messageId = await this.firebaseMessageService.update(this.message);
    if (true) {
      //this.firebaseChannelService.currentChannel.messages.push(messageId);
      //this.firebaseChannelService.updateChannel(this.firebaseChannelService.currentChannel);
      if (this.channelFirebaseService.selectedChannel) {
        this.channelFirebaseService.updateChannelMessage(this.channelFirebaseService.selectedChannel.id, this.message);
      }
    }
  }
}
