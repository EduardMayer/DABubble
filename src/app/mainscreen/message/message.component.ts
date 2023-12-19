import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Message } from 'src/models/message.class';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { Reaction } from 'src/models/reaction.class';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { User } from 'src/models/user.class';
import { UserProfileService } from 'src/services/user-profile.service';
import { FormatService } from 'src/services/format.service';


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
    public threadService: ThreadFirebaseService,
    private userProfileService: UserProfileService,
    public formatService: FormatService
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


  /**
  * Handles the selection of an emoji and manages reactions.
  *
  * @param {string} selectedEmoji - The selected emoji.
  * @returns {void}
  * 
  * This method is triggered when an emoji is selected. It performs the following actions:
  * - Emits the selected emoji using the emojiSelectedOutput EventEmitter.
  * - If the selected emoji is "noSelection," it closes the emoji bar.
  * - Manages reactions for the selected emoji:
  *   - If the emoji is not in the loaded reactions, it creates a new reaction.
  *   - If the emoji is already in the loaded reactions:
  *     - If the reaction has no users, it adds the current user.
  *     - If the current user is already in the reaction, it removes the user; otherwise, it adds the user.
  */
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


  /**
 * Handles the request to edit a message.
 *
 * @param {boolean} editMessage - A boolean flag indicating whether to edit the message.
 * @returns {void}
 * 
 * This method is triggered when there is a request to edit a message. It takes a boolean flag:
 * - If `editMessage` is `false`, it sets the `editMessage` property to `false`.
 * - If `editMessage` is `true`, it sets the `editMessage` property to `true` and closes the toolbar.
 */
  handleMessageEdit(editMessage: boolean) {
    if (editMessage == false) {
      this.editMessage = false;
    } else {
      this.editMessage = true;
      this.closeToolbar();
    }
  }


  /**
  * Handles the deletion of a message based on the specified boolean value.
  * @returns {void}
  */
  handleMessageDelete(){
    if(this._message)
    this.messageService.deleteMessage(this._message.path);
  }


  /**
  * Creates a new reaction for the selected emoji and updates the message with the new reaction.
  *
  * @param {string} selectedEmoji - The selected emoji for which to create a reaction.
  * @returns {void}
  * 
  * This method creates a new reaction with the provided emoji:
  * - Initializes the new reaction with the emoji and the current user as the only user.
  * - Adds the new reaction to the loaded reactions in the message service.
  * - Constructs the path for the reactions in the message.
  * - Updates the message with the new reaction using the message service.
  */
  createReaction(selectedEmoji: string) {
    const newReaction = new Reaction({
      name: selectedEmoji,
      users: [this.userService.currentUser.id]
    }
    )
    this.messageService.loadedReactions.push(newReaction);
    let path = this._message?.path + "/reactions";

    this.messageService.updateReaction(newReaction, path);
  }

  /**
  * Closes the emoji bar by setting the showMessageReactions property to false.
  */
  closeEmojiBar() {
    this.showMessageReactions = false;
  }


  /**
  * Updates a reaction by adding the current user to the list of users for the specified reaction.
  *
  * @param {number} reactionIndex - The index of the reaction to be updated in the loaded reactions array.
  * 
  * This method updates a reaction by adding the current user to the list of users for the specified reaction:
  * - Retrieves the message service's loaded reactions array and adds the current user to the specified reaction.
  * - Updates the message with the modified reaction using the message service.
  */
  updateReactionAddCurrentUser(reactionIndex: number) {
    if (this._message) {
      this.messageService.loadedReactions[reactionIndex].users.push(this.userService.currentUser.id);
      this.messageService.updateReaction(this.messageService.loadedReactions[reactionIndex], this._message.path + "/reactions");
    }
  }


  /**
  * Updates a reaction by removing the current user from the list of users for the specified reaction.
  *
  * @param {number} reactionIndex - The index of the reaction to be updated in the loaded reactions array.
  * @param {number} userIndex - The index of the current user in the list of users for the specified reaction.
  * 
  * This method updates a reaction by removing the current user from the list of users for the specified reaction:
  * - Retrieves the message service's loaded reactions array and removes the current user from the specified reaction.
  * - Updates the message with the modified reaction using the message service.
  */
  updateReactionRemoveCurrentUser(reactionIndex: number, userIndex: number) {
    if (this._message) {
      this.messageService.loadedReactions[reactionIndex].users.splice(userIndex, 1);
      this.messageService.updateReaction(this.messageService.loadedReactions[reactionIndex], this._message.path + "/reactions");
    }
  }


  /**
  * Toggles the visibility of message reactions.
  *
  * @param {Event} event - The event object triggering the toggle.
  * @returns {void}
  */
  toggleReactions(event: Event) {
    event.stopPropagation();
    if (this.showMessageReactions) {
      this.showMessageReactions = false;
    } else {
      this.showMessageReactions = true;
    }
  }


  /**
  * Opens the toolbar by setting the showToolbar property to true.
  */
  openToolbar() {
    this.showToolbar = true;
  }

  /**
  * Closes the toolbar by setting the showToolbar property to false.
  */
  closeToolbar() {
    this.showToolbar = false;
  }


  /**
  * Sets the author's name and avatar based on the provided author ID.
  *
  * @param {string} autorId - The unique identifier of the author.
  * @returns {Promise<void>}
  * 
  * This asynchronous method sets the author's name and avatar based on the provided author ID:
  * - Retrieves the user values associated with the author ID using the userService.
  * - Updates the autorUser, autorName, and autorAvatar properties with the retrieved values.
  * - If autorValues are available, assigns the fullName to autorName and the avatar to autorAvatar.
  * - If fullName or avatar is empty, assigns default values ("Guest" and a default avatar).
  * - If autorValues are not available, assigns default values ("Guest" and a default avatar).
  */
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


  /**
  * Retrieves the timestamp of the last message in the loaded answers and formats it to HH:MM.
  *
  * @returns {string} - The formatted timestamp in the HH:MM format.
  * 
  * This method calculates the maximum timestamp from the loaded answers' messages:
  * - Uses Math.max to find the maximum timestamp among the loaded answers.
  * - Calls formatTimestampToHHMM from the formatService to format the maximum timestamp to HH:MM.
  * - Returns the formatted timestamp.
  */
  getLastMessage(){
    const maxTimestamp = Math.max(...this.messageService.loadedAnswers.map(message => message.timestamp));
    return this.formatService.formatTimestampToHHMM(maxTimestamp);
  }


  /**
  * Opens the user profile for the author associated with the current message.
  */
  openUserProfil() {
    this.userProfileService.openUserProfil(this.autorUser);
  }


  /**
  * Checks if the given file name represents a PDF file.
  *
  * 
  * This method checks if the given file name represents a PDF file by examining its extension.
  */
  isPDF(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }

}

