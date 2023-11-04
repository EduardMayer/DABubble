import { Component, Input } from '@angular/core';
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
    console.log(this.emoji);
    console.log(this.count);
  }
}
