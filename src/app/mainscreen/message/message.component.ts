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
  messageLocation: string | undefined;
  messageLocationPath: string | undefined;
  showMessageReactions: any;




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

  @Input() set messageLocationName(value: string) {
    this.messageLocation = value;
    this.messageLocationPath = this.getMessagePath(value);

  }

  handleEmojiSelection(selectedEmoji: string) {
    console.log("handleEmojiSelection");
    const reactions = this.messageFirebaseService.loadedReactions;
    let foundEmojiIndex = this.messageFirebaseService.loadedReactions.findIndex((reaction) => reaction.name == selectedEmoji);
    console.log("FoundEmojiIndex:" + foundEmojiIndex);
    if (foundEmojiIndex == -1) {
      this.createReaction(selectedEmoji);
    } else {
      if (!this.messageFirebaseService.loadedReactions[foundEmojiIndex] || this.messageFirebaseService.loadedReactions[foundEmojiIndex].users.length == 0) {
        this.updateReactionAddCurrentUser(foundEmojiIndex);
      } else {
        let foundUserIndex = this.messageFirebaseService.loadedReactions[foundEmojiIndex].users.findIndex((userId) => userId == this.userFirebaseService.currentUser.id);
        if (foundUserIndex == -1) {
          this.updateReactionAddCurrentUser(foundEmojiIndex);
        } else {
          this.updateReactionRemoveCurrentUser(foundEmojiIndex, foundUserIndex);
        }
      }
    }
  }


  createReaction(selectedEmoji: string) {
    console.log("create Reaction: " + selectedEmoji);
    const newReaction = new Reaction({
      name: selectedEmoji,
      users: [this.userFirebaseService.currentUser.id]
    }
    )
    this.messageFirebaseService.loadedReactions.push(newReaction);
    let path = this.messageLocationPath + "/reactions";

    this.messageFirebaseService.updateReaction(newReaction, path);
  }


  //Unfinished: path for channelmessages is set
  getMessagePath(messageLocation: string) {

    let path = "";
    if (messageLocation == 'channel') {
      if (this.channelFirebaseService.selectedChannel && this._message) {
        path = "channels/" + this.channelFirebaseService.selectedChannel.id + "/messages/" + this._message.id
      }
    } else if (messageLocation == 'thread') {

    } else if (messageLocation == 'chat') {

    }

    return path;
  }

  updateReactionAddCurrentUser(reactionIndex: number) {
    console.log("updated Reaction, user added");
    this.messageFirebaseService.loadedReactions[reactionIndex].users.push(this.userFirebaseService.currentUser.id);
    this.messageFirebaseService.updateReaction(this.messageFirebaseService.loadedReactions[reactionIndex]);
  }

  updateReactionRemoveCurrentUser(reactionIndex: number, userIndex: number) {
    console.log("updated Reaction, user removed");
    this.messageFirebaseService.loadedReactions[reactionIndex].users.splice(userIndex, 1);
    this.messageFirebaseService.updateReaction(this.messageFirebaseService.loadedReactions[reactionIndex]);
  }

  toggleReactions(event: Event) {
    event.stopPropagation();
    if (this.showMessageReactions) {
      this.showMessageReactions = false;
    } else {
      console.log()
      this.showMessageReactions = true;
    }
  }

  hideReactions(event: Event) {
    event.stopPropagation();
    this.showMessageReactions = false;
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

