import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() isOwnMessage: boolean | undefined;
  showMessageOptions: boolean = false;

  showOptions(event: Event) {
    event.stopPropagation();
    this.showMessageOptions = true;
    console.log("Show Options");
  }

  hideOptions(event: Event) {
    event.stopPropagation();
    this.showMessageOptions = false;
    console.log("Hide Options");
  }

  openMenu(event: Event) {
    // Prevent event propagation to avoid triggering a mouseleave on the parent
    event.stopPropagation();
    // Additional logic to open the menu if needed
  }

 
}
