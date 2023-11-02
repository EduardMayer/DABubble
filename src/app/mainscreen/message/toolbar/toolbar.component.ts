import { Component, Input } from '@angular/core';
import { Message } from 'src/models/message.class';
import { Reaction } from 'src/models/reaction.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() isOwnMessage: boolean | undefined;
  @Input() message: Message | undefined;
  showMessageOptions: boolean = false;
  showMessageReactions: boolean = false;

  constructor(private userFirebaseService: UserFirebaseService){
    
  }

  handleEmojiSelection(selectedEmoji: string) {
    // Handle the selected emoji here, for example, log it to the console.
    console.log(`Selected emoji: ${selectedEmoji}`);
    //this.message.content+=`selectedEmoji`;


    if(this.message){
      console.log(this.message);
      let reactionId = this.message.getReactionId(selectedEmoji);
      if (reactionId) {
        this.message.reactions[reactionId].users.push(this.userFirebaseService.currentUser.id);
      } else {
        this.message.reactions.push(new Reaction(
          {
            name: selectedEmoji,
            users: [this.userFirebaseService.currentUser.id]
          }
        )
        )
      }
    }
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
      console.log()
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
