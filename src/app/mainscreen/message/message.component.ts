import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Message } from 'src/models/message.class';
import { MatCardModule } from '@angular/material/card';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [MessageFirebaseService]
})
export class MessageComponent {

  //@Input() message: Message | undefined;
  @Output() messageTimestampEvent = new EventEmitter<number>();


  _message: Message = new Message();
  userName: String | undefined;
  constructor(public userFirebaseService: UserFirebaseService) {
  }

  @Input() set message(value: Message) {
    this._message = value;
    this.setUser(value);
  };


  async setUser(message: Message) {
    this.userName = "";
    if (message.autorId == "") {
      this.userName = "Unknown";
    } else {
      const user = await this.userFirebaseService.getById(message.autorId);
      if (user) {
        this.userName = user.firstName + " " + user.lastName;
      }
    }

  }


  formatTimestampToHHMM(timestamp: number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits with leading zero

    return hours + ':' + minutes;
  }
}
