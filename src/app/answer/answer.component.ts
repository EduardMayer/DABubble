import { Component, Input } from '@angular/core';
import { Message } from 'src/models/message.class';
import { Reaction } from 'src/models/reaction.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent {
  public _message: Message | undefined;
  public autorName: string = "";
  public autorAvatar: string = "";
  isOwnMessage: boolean = false;
  showToolbar: boolean = false;
  @Input() messageLocation: string | undefined;



  constructor(
    public messageFirebaseService: MessageFirebaseService,
    public userFirebaseService: UserFirebaseService,
    public threadFirebaseService: ThreadFirebaseService,
    private channelFirebaseService: ChannelFirebaseService
  ) { }

  @Input()
  public set message(value: Message) {
    this._message = value;

    this.messageFirebaseService.loadReactions(value);
    this.setAutorName(this._message.autorId);
    if (this._message.autorId == this.userFirebaseService.currentUser.id) {
      this.isOwnMessage = true;
      document.getElementById(this._message.id)?.classList.add('inverted');
    }
  }

  handleEmojiSelection(selectedEmoji: string) {
    // Handle the selected emoji here, for example, log it to the console.
    console.log(`Selected emoji: ${selectedEmoji}`);
    //this.message.content+=`selectedEmoji`;

    let reactionId = this.message.getReactionId(selectedEmoji);
    if (reactionId && this._message) {
      this._message.reactions[reactionId].users.push(this.userFirebaseService.currentUser.id);
    } else {

      console.log(this.message.id);

      if (!this.message.reactions) {
        this.message.reactions = [];
      }
      this.message.reactions.push(new Reaction(
        {
          name: selectedEmoji,
          users: [this.userFirebaseService.currentUser.id]
        }
      )
      )
    }
    if (this.channelFirebaseService.selectedChannel && this._message) {
      this.channelFirebaseService.updateChannelMessage(this.channelFirebaseService.selectedChannel.id, this._message);
    }
    console.log(this.message.reactions);
  }

  openToolbar() {
    this.showToolbar = true;
  }

  closeToolbar() {
    this.showToolbar = false;
  }

  async setAutorName(autorId: string) {
    const autorValues = await this.userFirebaseService.getUserByUID(autorId);

    if (autorValues) {
      this.autorName = autorValues.fullName;
      this.autorAvatar = autorValues.avatar;

      if (this.autorName == "") {
        this.autorName = "Guest";
      }

      if (this.autorAvatar == "") {
        this.autorAvatar = "assets/img/avatar/avatar1.svg";
      }
    } else {
      this.autorName = "Guest";
      this.autorAvatar = "assets/img/avatar/avatar1.svg";
    }
  }




  formatTimestampToHHMM(timestamp: number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits with leading zero

    return hours + ':' + minutes;
  }
}
