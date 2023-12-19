import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { User } from 'src/models/user.class';
import { StorageFirebaseService } from 'src/services/storage-firebase.service';
import { MentionDirective } from 'angular-mentions';
import { FormatService } from 'src/services/format.service';



@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent {

  fileName: string = '';
  message = new Message();
  showEmojiBar: boolean = false;
  showUserSearch: boolean = false;
  _path: string | undefined;
  location: string | undefined;
  searchResultsUsers: User[] = [];
  searchValue: string = "";
  file: string = "";
  imageUrl?: string;
  showAutocomplete: boolean = false;
  fileIMG: any;

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
    private userService: UserFirebaseService,
    private channelService: ChannelFirebaseService,
    private messageService: MessageFirebaseService,
    private storageService: StorageFirebaseService,
    private formatService: FormatService
  ) { }

  /**
  * Asynchronously creates and sends a message to a selected channel.
  * This function sets the timestamp for the message and updates the selected channel with the message.
  * After sending the message, it resets the `message` object to a new instance of the Message class.
  * 
  * @returns {Promise<void>}
  */
  async createMessage() {
    if (this.message.content || this.file) {
      this.message.timestamp = Date.now();
      this.setMessageAutor();
      if (this._path) {
        this.message.fileSrc = this.file;
        this.message.fileName = this.fileName;
        await this.messageService.createMessage(this._path, this.message);
        this.message.content="";
      }
      this.message = new Message();
      this.showEmojiBar = false;
      this.file = '';
    }
  }

  /**
   * Gets the appropriate placeholder text based on the current location.
   *
   * @returns {string} The placeholder text.
   */
  getPlaceholder() {
    if (this.location == 'thread') {
      return "Antworten";
    } else if (this.location == "channel" && this.channelService.selectedChannel) {
      return "Nachricht an #" + this.formatService.cutStrLen(this.channelService.selectedChannel.channelName);
    } else {
      return "Nachricht scheiben";
    }
  }


  /**
  * Focuses on the HTML textarea element with the ViewChild reference.
  */
  focusTextInput() {
    if (this.textInput && this.textInput.nativeElement) {
      this.textInput.nativeElement.focus();
    }
  }


  //Autocomplete Options
  @ViewChild(MentionDirective) mention: MentionDirective | undefined;
  items: string[] = this.getCurrentUsersAsStringArray();

  mentionConfig: { items: string[], triggerChar: string, dropUp: boolean } = {
    items: this.getCurrentUsersAsStringArray(),
    triggerChar: "@",
    dropUp: true
  };


  /**
  * Retrieves an array of user names as strings from the loaded users.
  *
  * @returns {string[]} An array of user names.
  */
  getCurrentUsersAsStringArray() {
    let usersByName: string[] = [];
    this.userService.loadedUsers.forEach((user) => {
      usersByName.push(user.fullName);
    });
    return usersByName;
  }

  
  /**
  * Adds the "@" symbol to the text input.
  */
  addATtoMsg() {
    this.textInput.nativeElement.value += "@";
  }

  handleMentionClosure(){
    let str=this.textInput.nativeElement.value;
    if (str.charAt(str.length - 1) === '@') {
      this.textInput.nativeElement.value=str.slice(0, -1);
    }
  }


  /**
  * Initiates the mention search.
  *
  * This method checks if the mention object is defined and, if so, starts the mention search.
  *
  * @returns {void}
  */
  insAt() {
    if (this.mention) {
      this.mention.startSearch();
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


  handleEmojiSelection(selectedEmoji: string) {
    if (selectedEmoji == "noSelection") {
      this.closeEmojiBar();
    } else {
      this.message.content += selectedEmoji;
    }
  }


  /**
  * Sets the author and avatar information for a message.
  * This function populates the `autorId` and `avatarSrc` properties of the message object.
  * If the current user is not authenticated or lacks the required properties, default values are used.
  * 
  * @returns {void}
  */
  setMessageAutor() {
    this.message.autorId = this.userService.currentUser.id;

    this.message.avatarSrc = this.userService.currentUser.avatar;

    if (!this.message.autorId) {
      this.message.autorId = "";
    }

    if (!this.message.avatarSrc) {
      this.message.avatarSrc = "assets/img/avatar/avatar0.svg";
    }
  }


  /**
  * Opens a message and sets it as the current message.
  * 
  * @param {Message} message - The message to be opened.
  * @returns {void}
  */
  openMessage(message: Message) {
    this.message = message;
  }


  /**
   * Uploads a file, validates its type and size, and updates the component properties accordingly.
   * 
   * @param {HTMLInputElement} input
   * @returns {Promise<void>}
   */
  async uploadFile(input: HTMLInputElement) {
    if (!input.files || !input.files.length) return;
    const file = input.files[0];
    try {
      if (!this.isFileSizeValid(file)) {
        throw new Error('File is too large. Maximum file size is 500 KB.');
      }
      const url = await this.storageService.uploadFile(file, 'files');
      this.file = url;
      this.fileName = file.name;
      this.fileIMG = this.isPdfFile(file) ? 'assets/img/icons/pdf-icon2.svg' : url;
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  }


  /**
  * Checks if a given file is a PDF based on its type.
  * 
  * @param {File} file - The file to be checked.
  * @returns {boolean} - True if the file is a PDF, false otherwise.
  */
  isPdfFile(file: File): boolean {
    return file.type === 'application/pdf';
  }


  /**
 * Checks if the size of a given file is within the allowed limit (500 KB).
 * 
 * @param {File} file - The file to be checked.
 * @returns {boolean} - True if the file size is valid, false otherwise.
 */
  isFileSizeValid(file: File): boolean {
    return file.size <= 500000;
  }


  /**
  * Deletes the currently stored file from the storage service.
  * 
  * @returns {Promise<void>}
  */
  async deleteFile() {
    try {
      await this.storageService.deleteImage(this.file);
      this.file = '';
    } catch (error) {
      console.error('Error deleting file: ', error);
    }
  }
}