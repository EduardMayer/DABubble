import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from 'src/models/message.class';
import { Reaction } from 'src/models/reaction.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';


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

  constructor(
    public messageFirebaseService: MessageFirebaseService) {

  }

  /*
  updateReaction(message: Message, reactionId: number | null, selectedEmoji: string, messageType: string = "channel",path: string)
  */


  handleEmojiSelection(selectedEmoji: string) {
    this.emojiSelectedOutput.emit(selectedEmoji);
  }

  toggleOptions(event: Event) {
    event.stopPropagation();
    if (this.showMessageOptions) {
      this.showMessageOptions = false;
    } else {
      this.showMessageOptions = true;
      this.hideReactions(event);
    }
  }

  hideOptions(event: Event) {
    event.stopPropagation();
    this.showMessageOptions = false;

  }

  toggleReactions(event: Event) {
    event.stopPropagation();
    if (this.showMessageReactions) {
      this.showMessageReactions = false;
    } else {
      this.showMessageReactions = true;
      this.hideOptions(event);
    }
  }

  hideReactions(event: Event) {
    event.stopPropagation();
    this.showMessageReactions = false;
  }

  openMenu(event: Event) {
    // Prevent event propagation to avoid triggering a mouseleave on the parent
    event.stopPropagation();
    // Additional logic to open the menu if needed
  }

  openReactions(event: Event) {
    // Prevent event propagation to avoid triggering a mouseleave on the parent
    event.stopPropagation();
    // Additional logic to open the menu if needed
  }


}
