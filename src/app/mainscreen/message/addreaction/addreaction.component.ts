import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-addreaction',
  templateUrl: './addreaction.component.html',
  styleUrls: ['./addreaction.component.scss']
})
export class AddreactionComponent {
  isOpened = false;
  @Input() emojiInput$: Subject<string> | undefined;
  @ViewChild("container") container: ElementRef<HTMLElement> | undefined;

  @Output() emojiSelectedOutput: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  emojiSelected(event: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.emojiInput$?.next(event.emoji.native);
    const selectedEmoji = event.emoji.native;
    //console.log(selectedEmoji);
    this.emojiSelectedOutput.emit(selectedEmoji);
  }

  eventHandler = (event: Event) => {
    // Watching for outside clicks
    if (!this.container?.nativeElement.contains(event.target as Node)) {
      this.isOpened = false;
      window.removeEventListener("click", this.eventHandler);
    }
  };
}

