import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss']
})
export class BadgeComponent {
  @Input() count: number = 1;
}
