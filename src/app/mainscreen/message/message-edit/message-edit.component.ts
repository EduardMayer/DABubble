import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { StorageFirebaseService } from 'src/services/storage-firebase.service';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.scss']
})
export class MessageEditComponent {
  messageControl: FormControl = new FormControl();
  showEmojiBar: boolean = false;
  _path: string | undefined;
  _message: Message | undefined;
  fileName: string | undefined;
  fileSrc: string | undefined;
  fileIMG: any;

  @Output() showEditMessageOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set message(value: Message) {
    this._message = new Message(value);
  }

  constructor(
    public channelService: ChannelFirebaseService,
    private messageService: MessageFirebaseService,
    private storageService: StorageFirebaseService,
    private threadService: ThreadFirebaseService
  ) {  }

  /**
  * Asynchronously creates and sends a message to a selected channel.
  * This function sets the timestamp for the message and updates the selected channel with the message.
  * After sending the message, it resets the `message` object to a new instance of the Message class.
  * 
  * @returns {Promise<void>}
  */
  async saveMessage() {
    if (this._message) {
      if (this._message.path) {
        this.messageService.createMessage(this._message.path, this._message);
        this.updatedThreadMsg();
      }
      this.showEmojiBar = false;
      this.closeEditMode();
    }
  }

  updatedThreadMsg(){
    if(this.threadService.message && this._message){
      if(this.threadService.message.id == this._message.id){
        this.threadService.message=this._message;
      }
    }
  }

  closeEditMode() {
    this.showEditMessageOutput.emit(false);
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

  openMessage(message: Message) {
    this.message = message;
  }


  handleEmojiSelection(selectedEmoji: string) {
    if (selectedEmoji == "noSelection") {
      this.closeEmojiBar();
    } else {
      if (this._message) {
        this._message.content += selectedEmoji;
      }
    }
  }

  async deleteFile() {
    try {
      if (this._message && this._message.fileSrc) {
        await this.storageService.deleteImage(this._message.fileSrc);
        this._message.fileSrc = '';
        this._message.fileName = '';
      }
    } catch (error) {
      console.error('Error deleting file: ', error);
    }
  }
}
