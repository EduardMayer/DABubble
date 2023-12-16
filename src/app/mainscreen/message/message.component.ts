import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Message } from 'src/models/message.class';
import { MatCardModule } from '@angular/material/card';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { Reaction } from 'src/models/reaction.class';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { User } from 'src/models/user.class';
import { UserProfileService } from 'src/services/user-profile.service';
import { StorageFirebaseService } from 'src/services/storage-firebase.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [MessageFirebaseService]
})
export class MessageComponent {

  private autorUser = new User();
  public _message: Message | undefined;
  public autorName: string = "";
  public autorAvatar: string = "";
  isOwnMessage: boolean = false;
  showToolbar: boolean = false;
  editMessage: boolean = false;
  messageLocation: string | undefined;
  showMessageReactions: boolean = false;
  givenTimestamp: string | undefined;
  @Output() emojiSelectedOutput: EventEmitter<string> = new EventEmitter<string>();
  @Output() emojiBarVisibilityOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public messageService: MessageFirebaseService,
    private userService: UserFirebaseService,
    public threadFirebaseService: ThreadFirebaseService,
    private channelFirebaseService: ChannelFirebaseService,
    private userProfileService: UserProfileService,
    private storageService: StorageFirebaseService,
  ) { }

  @Input()
  public set message(value: Message) {
    this._message = value;
    this.messageService.loadReactions(value);
    this.messageService.loadAnswers(value);
    this.setAutorName(this._message.autorId);
    if (this._message.autorId == this.userService.currentUser.id) {
      this.isOwnMessage = true;
      document.getElementById(this._message.id)?.classList.add('inverted');
    }
  }

  @Input()
  public set timestampString(value: string) {
    this.givenTimestamp = value;
  }

  @Input() set messageLocationName(value: string) {
    this.messageLocation = value;
  }

  handleEmojiSelection(selectedEmoji: string) {
    const reactions = this.messageService.loadedReactions;
    this.emojiSelectedOutput.emit(selectedEmoji);
    if (selectedEmoji == "noSelection") {
      this.closeEmojiBar();
    } else {
      let foundEmojiIndex = this.messageService.loadedReactions.findIndex((reaction) => reaction.name == selectedEmoji);
      if (foundEmojiIndex == -1) {
        this.createReaction(selectedEmoji);
      } else {
        if (!this.messageService.loadedReactions[foundEmojiIndex] || this.messageService.loadedReactions[foundEmojiIndex].users.length == 0) {
          this.updateReactionAddCurrentUser(foundEmojiIndex);
        } else {
          let foundUserIndex = this.messageService.loadedReactions[foundEmojiIndex].users.findIndex((userId) => userId == this.userService.currentUser.id);
          if (foundUserIndex == -1) {
            this.updateReactionAddCurrentUser(foundEmojiIndex);
          } else {
            this.updateReactionRemoveCurrentUser(foundEmojiIndex, foundUserIndex);
          }
        }
      }
    }
  }

  handleMessageEdit(editMessage: boolean) {
    if (editMessage == false) {
      this.editMessage = false;
      console.log("edit No");
    } else {
      this.editMessage = true;
      console.log("edit Yes");
    }
  }



  createReaction(selectedEmoji: string) {
    console.log("create Reaction: " + selectedEmoji);
    const newReaction = new Reaction({
      name: selectedEmoji,
      users: [this.userService.currentUser.id]
    }
    )
    this.messageService.loadedReactions.push(newReaction);
    let path = this._message?.path + "/reactions";

    this.messageService.updateReaction(newReaction, path);
  }


  closeEmojiBar() {
    this.showMessageReactions = false;
  }


  updateReactionAddCurrentUser(reactionIndex: number) {
    if (this._message) {
      this.messageService.loadedReactions[reactionIndex].users.push(this.userService.currentUser.id);
      this.messageService.updateReaction(this.messageService.loadedReactions[reactionIndex], this._message.path + "/reactions");
      console.log("updated Reaction, user added");
    }
  }


  updateReactionRemoveCurrentUser(reactionIndex: number, userIndex: number) {
    if (this._message) {
      console.log("updated Reaction, user removed");
      this.messageService.loadedReactions[reactionIndex].users.splice(userIndex, 1);
      this.messageService.updateReaction(this.messageService.loadedReactions[reactionIndex], this._message.path + "/reactions");
    }
  }



  toggleReactions(event: Event) {
    event.stopPropagation();
    if (this.showMessageReactions) {
      this.showMessageReactions = false;
    } else {
      this.showMessageReactions = true;
    }
  }



  openToolbar() {
    this.showToolbar = true;
  }


  closeToolbar() {
    this.showToolbar = false;
  }


  async setAutorName(autorId: string) {
    const autorValues = await this.userService.getUserByUID(autorId);
    this.autorUser = autorValues;

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


  getTimestamp(timestamp: number) {
    if (this.givenTimestamp) {
      return this.givenTimestamp;
    } else {
      return this.formatTimestampToHHMM(timestamp);
    }

  }


  formatTimestampToHHMM(timestamp: number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits with leading zero

    return hours + ':' + minutes;
  }

  openUserProfil() {
    this.userProfileService.openUserProfil(this.autorUser);
  }

  isPDF(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }

}

