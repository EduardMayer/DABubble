import { Component, Input } from '@angular/core';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule } from '@angular/forms';
import { MessageFirebaseService } from 'src/services/message-firebase.service';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent {

  messageControl: FormControl = new FormControl();
  message = new Message();
  showEmojiList: boolean = false;
  _path: string | undefined;
  location: string | undefined;


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
      this.showEmojiList = false;
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
  toggleEmojiList() {
    this.showEmojiList = !this.showEmojiList;
  }


  /**
  * Closes the emoji list by setting its visibility to false.
  */
  closeEmojiList() {
    this.showEmojiList = false;
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


  handleEmojiSelection(selectedEmoji: string) {
    // Handle the selected emoji here, for example, log it to the console.
    console.log(`Selected emoji: ${selectedEmoji}`);
    //this.message.content+=`selectedEmoji`;
    this.message.content += selectedEmoji;
  }
}