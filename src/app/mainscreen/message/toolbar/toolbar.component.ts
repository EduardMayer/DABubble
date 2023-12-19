import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from 'src/models/message.class';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';



@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() isOwnMessage: boolean | undefined;
  @Input() message: Message | undefined;
  @Input() messageLocation: string | undefined;
  showMessageOptions: boolean = false;
  showMessageReactions: boolean = false;
  @Output() emojiSelectedOutput: EventEmitter<string> = new EventEmitter<string>();
  @Output() editMessageOutput: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteMessageOutput: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  constructor(
    public threadService: ThreadFirebaseService) {
  }


  /**
  * Emits an event to indicate that a message should be edited.
  * @returns {void}
  */
  handleMessageEdit(){
    this.editMessageOutput.emit(true);
  }


  /**
  * Emits an event to indicate that a message should be deleted.
  * @returns {void}
  */
  handleMessageDelete(){
    this.deleteMessageOutput.emit(true);
  }

  
  /**
  * Handles the selection of an emoji.
  *
  * This method is called when an emoji is selected, and it performs the following actions:
  * - If the selected emoji is "noSelection", it hides the message reactions.
  * - If a valid emoji is selected, it emits the selected emoji using the `emojiSelectedOutput` EventEmitter.
  *
  * @param {string} selectedEmoji - The emoji selected by the user.
  * @returns {void}
  */
  handleEmojiSelection(selectedEmoji: string) {
    if (selectedEmoji == "noSelection") {
      this.showMessageReactions = false;
    } else {
      this.emojiSelectedOutput.emit(selectedEmoji);
    }
  }


  /**
  * Handles the selection of an emoji.
  *
  * This method is called when an emoji is selected, and it performs the following actions:
  * - If the selected emoji is "noSelection", it hides the message reactions.
  * - If a valid emoji is selected, it emits the selected emoji using the `emojiSelectedOutput` EventEmitter.
  *
  * @param {string} selectedEmoji - The emoji selected by the user.
  * @returns {void}
  */
  toggleOptions(event: Event) {
    event.stopPropagation();
    if (this.showMessageOptions) {
      this.showMessageOptions = false;
    } else {
      this.showMessageOptions = true;
      this.hideReactions(event);
    }
  }


  /**
  * Hides message options by setting the showMessageOptions flag to false.
  * 
  * @param {Event} event - The event object that triggered the method.
  * @returns {void}
  */
  hideOptions(event: Event) {
    event.stopPropagation();
    this.showMessageOptions = false;
  }


  /**
  * Toggles the visibility of message reactions.
  *
  * This method is typically called in response to an event and performs the following actions:
  * - If message reactions are currently visible, hides them by setting showMessageReactions to false.
  * - If message reactions are not visible, shows them and hides other options by calling hideOptions.
  * 
  * @param {Event} event - The event object that triggered the method.
  * @returns {void}
  */
  toggleReactions(event: Event) {
    event.stopPropagation();
    if (this.showMessageReactions) {
      this.showMessageReactions = false;
    } else {
      this.showMessageReactions = true;
      this.hideOptions(event);
    }
  }


  /**
  * Hides message reactions by setting the showMessageReactions flag to false.
  *
  * This method is typically called in response to an event, and it prevents the event propagation
  * to ensure that the message reactions are hidden without affecting other components or actions.
  *
  * @param {Event} event - The event object that triggered the method.
  * @returns {void}
  */
  hideReactions(event: Event) {
    event.stopPropagation();
    this.showMessageReactions = false;
  }

}
