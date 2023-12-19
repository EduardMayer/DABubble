import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reaction } from 'src/models/reaction.class';

@Component({
  selector: 'app-reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss']
})
export class ReactionComponent {
  emoji: string = "";
  count: number | undefined;

  @Input()
  public set reaction(value: Reaction) {
    this.emoji = value.name;
    this.count = value.users.length;
  }

  @Output() emojiSelectedOutput: EventEmitter<string> = new EventEmitter<string>();


  /**
  * Handles the selection of an emoji.
  *
  * This method logs the selected emoji to the console and emits the selected emoji using the emojiSelectedOutput EventEmitter.
  * 
  * @returns {void}
  */
  emojiSelected() {
    this.emojiSelectedOutput.emit(this.emoji);
  }
}
