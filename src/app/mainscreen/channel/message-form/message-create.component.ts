import { Component } from '@angular/core';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent {

  messageControl: FormControl = new FormControl();
  message = new Message();
  textarea: HTMLTextAreaElement | undefined;
  showEmojiList: boolean = false;

  constructor(
    private userFirebaseService: UserFirebaseService,
    public channelFirebaseService: ChannelFirebaseService
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

      if (this.channelFirebaseService.selectedChannel) {
        this.channelFirebaseService.updateChannelMessage(this.channelFirebaseService.selectedChannel.id, this.message);
        this.message = new Message();
      }
    }
  }

  toggleEmojiList() {
    this.showEmojiList = !this.showEmojiList;
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

  calcHeight(value: string) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    // min-height + lines x line-height + padding + border
    let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
    return newHeight;
  }

  handleEmojiSelection(selectedEmoji: Event) {
    // Handle the selected emoji here, for example, log it to the console.
    console.log(`Selected emoji: ${selectedEmoji}`);
  }
  /*
  ngAfterViewInit() {
    this.calcHeight->
    if (this.textarea) {
      this.textarea.addEventListener("keyup", () => {
        if (this.textarea) {
          this.textarea.style.height = this.calcHeight(this.textarea.value) + "px";
        }
      });
    }
  }
  */
}
