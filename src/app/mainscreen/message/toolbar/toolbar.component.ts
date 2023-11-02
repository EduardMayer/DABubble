import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() isOwnMessage: boolean | undefined;
  showMessageOptions: boolean = false;
  showMessageReactions: boolean = false;

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