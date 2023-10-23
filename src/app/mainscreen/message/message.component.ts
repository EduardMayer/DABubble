import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from 'src/models/message.class';
import { MessageFirebaseService } from 'src/services/message-firebase.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [MessageFirebaseService]
})
export class MessageComponent implements OnChanges {

  @Input() id: string = "";
  message: Message | undefined;

  constructor(public messageFirebaseService: MessageFirebaseService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.getMessage();
    }
  }

  getMessage() {
    this.messageFirebaseService.getById(this.id);
  }
}
