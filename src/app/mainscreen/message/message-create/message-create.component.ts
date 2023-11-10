import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { FormControl } from '@angular/forms';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent {

  messageControl: FormControl = new FormControl();
  message = new Message();
  showEmojiBar: boolean = false;
  showUserSearch: boolean = false;
  _path: string | undefined;
  location: string | undefined;
  searchResultsUsers: User[] = [];
  searchValue: string = "";

  @ViewChild('textInput') textInput!: ElementRef;
  @ViewChild('inputFieldUserSearch') inputFieldUserSearch!: ElementRef;


  /**
  * Setter for the 'path' property decorated with @Input().
  * @param value - The new 'path' value (string).
  */
  @Input()
  public set path(value: string) {
    this._path = value;
  }

  @Input()
  public set currentLocation(value: string) {
    this.location = value;
  }

  constructor(
    private userFirebaseService: UserFirebaseService,
    public channelFirebaseService: ChannelFirebaseService,
    private messageFirebaseService: MessageFirebaseService,
  ) { }

  /**
  * Asynchronously creates and sends a message to a selected channel.
  * This function sets the timestamp for the message and updates the selected channel with the message.
  * After sending the message, it resets the `message` object to a new instance of the Message class.
  * 
  * @returns {Promise<void>}
  */
  async createMessage() {
    if (this.message.content) {
      this.message.timestamp = Date.now();
      this.setMessageAutor();
      if (this._path) {
        this.messageFirebaseService.createMessage(this._path, this.message);
      }
      this.message = new Message();
      this.showEmojiBar = false;
    }
  }


  getPlaceholder() {
    if (this.location == 'thread') {
      return "Antworten";
    } else if (this.location == "channel" && this.channelFirebaseService.selectedChannel) {
      return "Nachricht an #" + this.channelFirebaseService.selectedChannel.channelName;
    } else {
      return "Nachricht scheiben";
    }
  }


  /**
   * Toggles the visibility of the emoji list.
   */
  toggleEmojiBar(event: Event) {
    event.stopPropagation();
    this.showEmojiBar = !this.showEmojiBar;
  }


  /**
  * Closes the emoji list.
  */
  closeEmojiBar() {
    this.showEmojiBar = false;
  }


  /**
  * Sets the author and avatar information for a message.
  * This function populates the `autorId` and `avatarSrc` properties of the message object.
  * If the current user is not authenticated or lacks the required properties, default values are used.
  * 
  * @returns {void}
  */
  setMessageAutor() {
    this.message.autorId = this.userFirebaseService.currentUser.id;

    this.message.avatarSrc = this.userFirebaseService.currentUser.avatar;

    if (!this.message.autorId) {
      this.message.autorId = "";
    }

    if (!this.message.avatarSrc) {
      this.message.avatarSrc = "assets/img/avatar/avatar0.svg";
    }
  }

  openMessage(message: Message) {
    this.message = message;
  }

  toogleUserSearch(event: Event) {
    this.showUserSearch = !this.showUserSearch;
    event.stopPropagation();
  }

  checkForAt() {
    const messageArray: String[] = this.message.content.split(" ");
    let lastWord = messageArray[messageArray.length - 1];
    lastWord = lastWord.replaceAll("\n", "");
    if (lastWord.substring(0, 1) == "@") {
      const searchString = lastWord.substring(1, lastWord.length);
      //console.log("SearchString:" + searchString);
      if (searchString !== "") {
        this.searchValue = searchString;
        this.showUserSearch = true;
      } else {
        this.showUserSearch = true;
        this.searchResultsUsers = this.userFirebaseService.loadedUsers;
      }
    }
    else {
      this.showUserSearch = false;
      this.searchResultsUsers = [];
    }
  }


handleUserSearchResult(user: User | boolean) {
  if (user == false) {
    this.showUserSearch = false;
  } else if (user instanceof User) {
    this.showUserSearch = false;
    this.message.content += "@" + user.fullName;
  }
}

handleEmojiSelection(selectedEmoji: string) {
  if (selectedEmoji == "noSelection") {
    console.log("noSelection");
    this.closeEmojiBar();
  } else {
    this.message.content += selectedEmoji;
  }
}

getcursorStartPosition() {
  const inputElement: HTMLInputElement = this.textInput.nativeElement;
  const cursorPositionStart = inputElement.selectionStart;
  const cursorPositionEnd = inputElement.selectionEnd;
  //console.log(`Cursor start position: ${cursorPositionStart}`);
  //console.log(`Cursor end position: ${cursorPositionEnd}`);
  return cursorPositionStart;
}
}
