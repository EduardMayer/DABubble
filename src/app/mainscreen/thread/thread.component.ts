import { Component, Input } from '@angular/core';
import { Answer } from 'src/models/answer.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss', '../../../styles.scss']
})
export class ThreadComponent {

  answer = new Answer();
  showEmojiList: boolean = false;
  showToolbar: boolean = false;
  @Input() messageLocation: string | undefined;

constructor(public messageFirebaseService: MessageFirebaseService, public channelFirebaseService: ChannelFirebaseService, public userFirebase: UserFirebaseService)  {
  if(messageFirebaseService.checkIfOwnThread()) {
    this.showToolbar = true;
  }
 
}

toggleEmojiList() {
  this.showEmojiList = !this.showEmojiList;
}

closeEmojiList() {
  this.showEmojiList = false;
}

sendAnswer() {

}

openToolbar() {
  this.showToolbar = true;
}

closeToolbar() {
  this.showToolbar = false;
}

formatTimestampToHHMM(timestamp: number) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits with leading zero
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits with leading zero

  return hours + ':' + minutes;
}

}
