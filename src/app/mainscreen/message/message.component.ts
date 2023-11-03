import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Message } from 'src/models/message.class';
import { MatCardModule } from '@angular/material/card';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { Reaction } from 'src/models/reaction.class';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [MessageFirebaseService]
})
export class MessageComponent {

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
    const reactions = this.messageFirebaseService.loadedReactions;
    let foundEmojiIndex = this.messageFirebaseService.loadedReactions.findIndex((reaction) => reaction.name == selectedEmoji);

    if (!foundEmojiIndex) {
      this.messageFirebaseService.loadedReactions.push(new Reaction(
        {
          name: selectedEmoji,
          users: [this.userFirebaseService.currentUser.id]
        }
      ))
    } else {
      if (!this.messageFirebaseService.loadedReactions[foundEmojiIndex] || this.messageFirebaseService.loadedReactions[foundEmojiIndex].users.length == 0) {
        this.messageFirebaseService.loadedReactions.push(new Reaction(
          {
            name: selectedEmoji,
            users: [this.userFirebaseService.currentUser.id]
          }
        ))
      } else {
        let foundUserIndex = this.messageFirebaseService.loadedReactions[foundEmojiIndex].users.findIndex((userId) => userId = this.userFirebaseService.currentUser.id);
        if (foundUserIndex) {
          this.messageFirebaseService.loadedReactions[foundEmojiIndex].users.splice(foundUserIndex, 1);
        } else {
          this.messageFirebaseService.loadedReactions[foundEmojiIndex].users.push(this.userFirebaseService.currentUser.id)
        }
      }
    }
  }

  /* if (foundEmoji) {
     let user = reactions.find((reaction) => reaction.name == selectedEmoji);
   }
   


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
  
   console.log(this.message.reactions);
   */


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
function elseif() {
  throw new Error('Function not implemented.');
}

